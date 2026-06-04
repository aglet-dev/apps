// Reminders —— 用平台 OS 定时通知（notifications.schedule/cancel），不再轮询扫描。
//
// 工作流：建提醒(带 due_at) → notifications.schedule({id:记录id, at:due_ms})；
//         完成/删除 → notifications.cancel({id})；撤销完成 → 重排（若 due 在未来）。
// OS 到点投递，Aglet.app/daemon 休眠也响；无 due_scan job、无 notified_at 去重字段。

function dueMs(s) {
  if (!s) return null;
  const t = Date.parse(String(s).replace(" ", "T"));
  return isNaN(t) ? null : t;
}

async function schedule(ctx, id, title, notes, due) {
  const ms = dueMs(due);
  if (!id || ms == null) return;
  await ctx.dispatch("notifications.schedule", {
    id: id,
    title: "⏰ " + title,
    body: notes || "",
    at: ms,
    url: "aglet://reminders/",
  });
}

export default {
  // 新建提醒：建记录 → 拿 id → 排程（有 due 才排）→ 清表单。
  async addReminder(_args, ctx) {
    const f = ctx.form || {};
    const title = ((f.title || "") + "").trim();
    if (!title) return { ok: false };
    const rec = await ctx.dispatch("data.create", {
      collection: "items",
      data: {
        title: title,
        notes: f.notes || "",
        due_at: f.due_at || "",
        completed: false,
        created_at: new Date(ctx.now()).toISOString(),
      },
    });
    await schedule(ctx, rec && rec.id, title, f.notes, f.due_at);
    ctx.setStateAt("/form/title", "");
    ctx.setStateAt("/form/notes", "");
    ctx.setStateAt("/form/due_at", "");
    return { ok: true };
  },

  // 完成：标记 + 取消未来的通知。
  async complete(args, ctx) {
    await ctx.dispatch("data.update", {
      collection: "items",
      id: args.id,
      patch: { completed: true, completed_at: new Date(ctx.now()).toISOString() },
    });
    await ctx.dispatch("notifications.cancel", { id: args.id });
    return { ok: true };
  },

  // 撤销完成：复活 + 若 due 仍在未来重新排程。
  async uncomplete(args, ctx) {
    await ctx.dispatch("data.update", {
      collection: "items",
      id: args.id,
      patch: { completed: false, completed_at: "" },
    });
    await schedule(ctx, args.id, args.title || "", args.notes, args.due_at);
    return { ok: true };
  },

  // 删除：先取消通知再删记录。
  async remove(args, ctx) {
    await ctx.dispatch("notifications.cancel", { id: args.id });
    await ctx.dispatch("data.delete", { collection: "items", id: args.id });
    return { ok: true };
  },
};
