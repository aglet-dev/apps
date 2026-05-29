// HN ingest —— Scheduler C jobs 模式：interval 触发 ingest handler。
//
// 数据源：HN 官方 JSON API：
//   - https://hacker-news.firebaseio.com/v0/topstories.json  → ids 列表
//   - https://hacker-news.firebaseio.com/v0/item/<id>.json    → 单条详情
//
// 翻译：title_en → title + 一句 summary，走 llmctl (local provider)。
// 幂等：用原子 `data.upsert(by_field: "hn_id")` 替代 list-then-create dedup
//       —— Phase A 并发治理，避免两个并发 worker 同时 list 都未命中 → 都 create
//       → 同 hn_id 双插入。SQLite 单写事务保证 dedup 原子性。
// 用户字段 liked/disliked 只在 create 时初始化（upsert.upserted=="created" 分支）。

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

export default {
  async ingest(args, _ctx) {
    const MAX = (args && args.max) || DEFAULT_MAX;

    const ids_resp = fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    if (!ids_resp.ok) throw new Error(`topstories fetch failed: ${ids_resp.status}`);
    const ids = JSON.parse(ids_resp.body).slice(0, MAX);

    let added = 0;
    let updated = 0;
    let translated = 0;

    for (const id of ids) {
      const r = fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      if (!r.ok) continue;
      const item = JSON.parse(r.body);
      if (!item || item.type !== "story" || !item.title) continue;

      // 原子 dedup：单 SQLite tx 内 SELECT by hn_id + INSERT/UPDATE。
      // 仅写"稳定 / 每次 ingest 都该刷新"字段；title/summary/liked/disliked 等
      // 走第二段 update —— 既保留已翻译内容，也不覆盖用户操作。
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
        // 初次见到：translate + 初始化 user fields。
        const tzh = llmcall(TITLE_SYSTEM, item.title);
        const szh = llmcall(SUMMARY_SYSTEM, item.title);
        if (tzh) translated++;
        aglet.data.update(APP_ID, "stories", up.id, {
          title: tzh,
          summary: szh,
          age: "",
          liked: false,
          disliked: false,
        });
        added++;
      } else {
        // 已存在：仅在缺翻译时补，绝不覆盖已有 title/summary 或用户 like 状态。
        if (!up.data.title) {
          const tzh = llmcall(TITLE_SYSTEM, item.title);
          if (tzh) {
            aglet.data.update(APP_ID, "stories", up.id, { title: tzh });
            translated++;
          }
        }
        if (!up.data.summary) {
          const szh = llmcall(SUMMARY_SYSTEM, item.title);
          if (szh) aglet.data.update(APP_ID, "stories", up.id, { summary: szh });
        }
        updated++;
      }
    }

    return { fetched: ids.length, added, updated, translated };
  },
};
