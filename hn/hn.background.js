// HN ingest（JS 版，dispatcher 跑）。
//
// 数据源：HN 官方 JSON API（公开、稳定、零依赖）：
//   - https://hacker-news.firebaseio.com/v0/topstories.json  → ids 列表
//   - https://hacker-news.firebaseio.com/v0/item/<id>.json    → 单条详情
//
// 翻译：title_en → title_zh + 一句 summary_zh。走本机 llmctl（local provider）。
// 新加入的故事和"title_zh 为空"的旧故事都补翻译；已翻译的不重复花 token。
//
// 幂等：按 hn_id dedup。已存在 → update 仅覆盖 points/comments；不存在 → create。
//
// 用户字段 liked/disliked 永远只在 create 时初始化，update 时不动。

const APP_ID = (typeof input === "object" && input && input.app_id) || "hn";
const MAX = (typeof input === "object" && input && input.max) || 30;

function domainOf(u) {
  if (!u) return "";
  const m = /^https?:\/\/([^\/]+)/.exec(u);
  return m ? m[1].replace(/^www\./, "") : "";
}

/// llmctl 跑一次 prompt，buffer 模式拿全文。user-text 走 stdin（local provider
/// 在 argv 形式下偶尔 bail；stdin 形式严格守 system prompt）。失败返回空串。
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

  const existing = aglet.data.list(APP_ID, "stories", {
    where: { hn_id: id },
    limit: 1,
  });

  if (existing.items.length > 0) {
    const ex = existing.items[0];
    const patch = {
      points: item.score || 0,
      comments: item.descendants || 0,
    };
    // 补翻译：已有 row 但 title_zh / summary_zh 空 → 补一下
    if (!ex.data.title_zh) {
      const tzh = llmcall(TITLE_SYSTEM, item.title);
      if (tzh) {
        patch.title_zh = tzh;
        translated++;
      }
    }
    if (!ex.data.summary_zh) {
      const szh = llmcall(SUMMARY_SYSTEM, item.title);
      if (szh) patch.summary_zh = szh;
    }
    aglet.data.update(APP_ID, "stories", ex.id, patch);
    updated++;
  } else {
    const tzh = llmcall(TITLE_SYSTEM, item.title);
    const szh = llmcall(SUMMARY_SYSTEM, item.title);
    if (tzh) translated++;
    aglet.data.create(APP_ID, "stories", {
      hn_id: id,
      title_en: item.title,
      title_zh: tzh,
      url: item.url || `https://news.ycombinator.com/item?id=${id}`,
      domain: domainOf(item.url),
      summary_zh: szh,
      points: item.score || 0,
      comments: item.descendants || 0,
      author: item.by || "",
      age: "",
      liked: false,
      disliked: false,
    });
    added++;
  }
}

output = { fetched: ids.length, added, updated, translated };
