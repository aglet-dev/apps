// Reminders —— 声明式提醒（P2b-A）：app 不写 notifications.schedule/cancel，
// 只维护一个 `remind_at_ms`（epoch ms）字段；host 按 manifest.reminders 绑定，
// 在 data-write 后自动排程/取消（>0 排，<=0 或删除取消）。OS 到点投递，
// daemon/Aglet.app 休眠也响；无 due_scan job、无 notified_at 去重字段。

function dueMs(s) {
  if (!s) return 0;
  const t = Date.parse(String(s).replace(" ", "T"));
  return isNaN(t) ? 0 : t;
}

export default {
  // 新建：completed=false，remind_at_ms 取 due_at（有就排）。host 自动排程。
  async addReminder(_args, ctx) {
    const f = ctx.form || {};
    const title = ((f.title || "") + "").trim();
    if (!title) return { ok: false };
    await ctx.dispatch("data.create", {
      collection: "items",
      data: {
        title: title,
        notes: f.notes || "",
        due_at: f.due_at || "",
        remind_at_ms: dueMs(f.due_at),
        completed: false,
        created_at: new Date(ctx.now()).toISOString(),
      },
    });
    ctx.setStateAt("/form/title", "");
    ctx.setStateAt("/form/notes", "");
    ctx.setStateAt("/form/due_at", "");
    return { ok: true };
  },

  // 完成：清 remind_at_ms（→ host 自动取消未来通知）。
  async complete(args, ctx) {
    await ctx.dispatch("data.update", {
      collection: "items",
      id: args.id,
      patch: {
        completed: true,
        completed_at: new Date(ctx.now()).toISOString(),
        remind_at_ms: 0,
      },
    });
    return { ok: true };
  },

  // 撤销完成：复活 remind_at_ms（→ host 若 due 在未来自动重排）。
  async uncomplete(args, ctx) {
    await ctx.dispatch("data.update", {
      collection: "items",
      id: args.id,
      patch: { completed: false, completed_at: "", remind_at_ms: dueMs(args.due_at) },
    });
    return { ok: true };
  },

  // 删除：host 在 data.delete 后自动取消该 row 的通知。
  async remove(args, ctx) {
    await ctx.dispatch("data.delete", { collection: "items", id: args.id });
    return { ok: true };
  },
};
