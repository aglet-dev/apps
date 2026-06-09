// HN —— Scheduler C jobs 模式：interval 触发 ingest handler。
//
// 产品目标：打开 hn 即看到「当前 HN 热榜」列表，中文标题/摘要随后补上。
// 据此把 ingest 拆两段、解耦「抓取存储」与「翻译」（旧版每条 upsert 后同步跑 2 次
// llmctl 才到下一条 → 列表一条一条慢慢冒，要好几分钟才满）：
//   Phase 1（快）：fetch topstories + 各 item，批量 upsert 元数据，**不调 LLM**
//                  → ~30 条记录几秒内全落库，列表立即满（title 空时 UI 显 title_en）。
//   Phase 2（渐进）：扫未翻译的 story（title 空），逐条 llmctl 翻译标题+摘要并 update
//                  → 中文渐进出现；崩了/没跑完的下次 ingest 会补。
//
// 数据源：HN 官方 JSON API（topstories.json → ids；item/<id>.json → 详情）。
// 翻译：title_en → title + 一句 summary，走 llmctl (local provider)。
// 幂等：data.upsert(by_field: "hn_id") 原子 dedup；用户字段 liked/disliked 仅 create 初始化。

const APP_ID = "hn";
const DEFAULT_MAX = 30;

function domainOf(u) {
  if (!u) return "";
  const m = /^https?:\/\/([^\/]+)/.exec(u);
  return m ? m[1].replace(/^www\./, "") : "";
}

function llmcall(system, user) {
  try {
    const r = child_process.spawnSync(
      "llmctl",
      ["--provider", "local", "--system", system, "--buffer"],
      { input: user },
    );
    if (r.status === 0) return r.stdout.trim();
  } catch (_e) {}
  return "";
}

const TITLE_SYSTEM = "把英文 HN 标题翻成中文。技术名词（Rust / Kafka / GPU / OAuth 等）保留英文。仅输出译文一行，不加引号、不加前后缀。";
const SUMMARY_SYSTEM = "用 1 句中文（≤60 字）写这条 HN story 的看点：为什么它上 HN、争议点或核心结论。不要复述标题。仅输出一行中文。";

// data.list 在 script 侧返回 { items: [...] }（call 解 envelope.data）。容错处理。
export default {
  async ingest(args, _ctx) {
    const MAX = (args && args.max) || DEFAULT_MAX;

    const ids_resp = fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    if (!ids_resp.ok) throw new Error(`topstories fetch failed: ${ids_resp.status}`);
    const ids = JSON.parse(ids_resp.body).slice(0, MAX);

    // ── Phase 1（快）：抓 + 批量 upsert 元数据，不翻译。列表立即满。────────────
    // 顺手把「需翻译」的记录收进 pending（id + 英文标题），Phase 2 直接用 ——
    // 不回头 data.list（其 item 形态/字段嵌套不保证，曾因 s.title_en 取不到而整轮跳过）。
    let added = 0;
    let refreshed = 0;
    const pending = []; // { id, title_en }
    for (const id of ids) {
      const r = fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      if (!r.ok) continue;
      const item = JSON.parse(r.body);
      if (!item || item.type !== "story" || !item.title) continue;

      const up = aglet.data.upsert(APP_ID, "stories", "hn_id", {
        hn_id: id,
        title_en: item.title,
        url: item.url || `https://news.ycombinator.com/item?id=${id}`,
        domain: domainOf(item.url),
        author: item.by || "",
        points: item.score || 0,
        comments: item.descendants || 0,
      });

      if (up.upserted === "created") {
        // 初次见到：初始化用户字段 + 留空 title/summary 给 Phase 2 翻译补。
        aglet.data.update(APP_ID, "stories", up.id, {
          title: "",
          summary: "",
          age: "",
          liked: false,
          disliked: false,
        });
        added++;
        pending.push({ id: up.id, title_en: item.title });
      } else {
        refreshed++;
        // 已存在但还没译（up.data 是现有记录）→ 也补译；已译的不动（保留用户/已有内容）。
        const cur = up.data || {};
        if (!cur.title || !cur.summary) pending.push({ id: up.id, title_en: item.title });
      }
    }

    // ── Phase 2（渐进）：翻译 pending，逐条 update。列表已全出，这里只补中文。────
    let translated = 0;
    for (const p of pending) {
      const tzh = llmcall(TITLE_SYSTEM, p.title_en);
      const szh = llmcall(SUMMARY_SYSTEM, p.title_en);
      const patch = {};
      if (tzh) patch.title = tzh;
      if (szh) patch.summary = szh;
      if (Object.keys(patch).length > 0) {
        aglet.data.update(APP_ID, "stories", p.id, patch);
        translated++;
      }
    }

    return { fetched: ids.length, added, refreshed, translated };
  },
};
