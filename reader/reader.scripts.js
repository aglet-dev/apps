// Reader ingest —— Scheduler C jobs 模式：interval 触发 ingest handler。
//
// 工作流：扫 queue 表，对每行 url：
//   1. mdctl <url> → markdown
//   2. llmctl 总结 (≤80 字)
//   3. data.create articles + data.delete queue
// 幂等：queue 行处理完即删；articles 不 dedup（多次抓各成新行，便于看历史）。

const APP_ID = "reader";

function domainOf(u) {
  if (!u) return "";
  const m = /^https?:\/\/([^\/]+)/.exec(u);
  return m ? m[1].replace(/^www\./, "") : "";
}

function titleOf(md, url) {
  if (md) {
    const m = /^#\s+(.+)$/m.exec(md);
    if (m) return m[1].trim().slice(0, 200);
  }
  return domainOf(url) || url;
}

function runCmd(cmd, args, stdinText) {
  try {
    const r = child_process.spawnSync(cmd, args, stdinText != null ? { input: stdinText } : {});
    if (r.status === 0) return r.stdout.trim();
  } catch (_e) {}
  return null;
}

const SUMMARY_SYSTEM = "用 1-2 句中文（≤80 字）总结这篇文章的核心要点：写明结论/争议/适用场景，不要复述标题。仅输出中文一段，不加引号 / 前后缀。";

export default {
  async ingest(_, _ctx) {
    const pending = aglet.data.list(APP_ID, "queue", {
      orderBy: [{ field: "created_at", direction: "asc" }],
      limit: 50,
    });

    let fetched = 0, added = 0, failed = 0;

    for (const row of pending.items) {
      const url = row.data.url;
      if (!url) { aglet.data.delete(APP_ID, "queue", row.id); continue; }
      fetched++;
      const md = runCmd("mdctl", [url]);
      if (!md || md.length < 20) {
        aglet.data.delete(APP_ID, "queue", row.id);
        failed++;
        continue;
      }
      const summary = runCmd("llmctl", ["--provider", "local", "--system", SUMMARY_SYSTEM, "--buffer"], md) || "";
      aglet.data.create(APP_ID, "articles", {
        url: url,
        title: titleOf(md, url),
        domain: domainOf(url),
        summary: summary,
        content: md,
        fetched_at: Date.now(),
      });
      aglet.data.delete(APP_ID, "queue", row.id);
      added++;
    }

    return { fetched, added, failed };
  },
};
