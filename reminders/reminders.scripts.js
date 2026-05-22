// Reminders due 扫描器 —— Scheduler C jobs 模式：interval 触发 dueScan handler。
//
// 工作流：
//   1. 查所有 completed=false 的 items
//   2. 过滤 due_at <= now AND (notified_at 为空 OR notified_at < due_at)
//   3. 对每条 ctx.dispatch("app.notify", ...)
//   4. 写回 notified_at = now 避免下一轮重复

const APP_ID = "reminders";

function parseDue(s) {
  if (!s) return 0;
  const norm = s.replace(" ", "T");
  const t = Date.parse(norm);
  return isNaN(t) ? 0 : t;
}

export default {
  async dueScan(_, ctx) {
    const now = new Date();
    const nowIso = now.toISOString();
    const nowMs = now.getTime();

    const list = aglet.data.list(APP_ID, "items", {
      where: { completed: false },
      limit: 500,
    });

    let notified = 0;
    let skipped = 0;
    const fired = [];

    for (const row of list.items) {
      const d = row.data;
      if (!d.due_at) { skipped++; continue; }
      const dueMs = parseDue(d.due_at);
      if (!dueMs || dueMs > nowMs) { skipped++; continue; }
      if (d.notified_at) {
        const notifMs = parseDue(d.notified_at);
        if (notifMs >= dueMs) { skipped++; continue; }
      }
      ctx.dispatch("app.notify", {
        title: "⏰ " + d.title,
        body: d.notes || "到点了",
        url: "aglet://reminders/",
      });
      aglet.data.update(APP_ID, "items", row.id, { notified_at: nowIso });
      notified++;
      fired.push({ id: row.id, title: d.title, due_at: d.due_at });
    }

    return { notified, skipped, fired };
  },
};
