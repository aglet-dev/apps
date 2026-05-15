// Reminders due 扫描器：被 scheduler 周期触发。dispatcher 用 QuickJS 跑。
//
// 工作流：
//   1. 查所有 completed=false 的 items
//   2. 过滤 due_at <= now AND (notified_at 为空 OR notified_at < due_at)
//   3. 对每条 app.notify
//   4. 写回 notified_at = now，避免下一轮重复
//
// 替代 reminders.ingest.sh（73 行 bash + jq + date 的兼容 hack）。
// 约定：globalThis.input.app_id 指明 miniapp（dispatcher 注入），缺省 "reminders"。

const APP_ID = (typeof input === "object" && input && input.app_id) || "reminders";
const now = new Date();
const nowIso = now.toISOString();
const nowMs = now.getTime();

// Date.parse 接受 ISO 8601；用户写 "YYYY-MM-DD HH:MM" 也常见 → 把空格换 T 再 parse。
function parseDue(s) {
  if (!s) return 0;
  const norm = s.replace(" ", "T");
  const t = Date.parse(norm);
  return isNaN(t) ? 0 : t;
}

const list = corelet.data.list(APP_ID, "items", {
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
  // 触发系统通知
  corelet.bridge(APP_ID, "app.notify", {
    title: "⏰ " + d.title,
    body: d.notes || "到点了",
    url: "corelet://reminders/",
  });
  // 标记 notified_at 防重复
  corelet.data.update(APP_ID, "items", row.id, { notified_at: nowIso });
  notified++;
  fired.push({ id: row.id, title: d.title, due_at: d.due_at });
}

output = { notified, skipped, fired };
