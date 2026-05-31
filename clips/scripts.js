// clips —— 剪贴板历史。
//
// onClip：event bg job，订阅 `clipboard.changed`（daemon 侧 watcher 监
//   NSPasteboard.changeCount，变更时 emit；同 sysmon 的 emit 模型）。事件到了
//   才 readText 取内容，与最近一条去重后入库，裁到上限——不再每秒轮询读全文。
//   payload 形如 {changeCount:N}，这里用不到（只关心「变了，去读」）。
// copy / togglePin：UI 行点击调用（onClick={() => scripts.copy({id})}）。

const APP_ID = "clips";
const MAX_UNPINNED = 100; // 非置顶历史上限，超出删最旧

export default {
  async onClip(_event, ctx) {
    const res = await ctx.plugins.clipboard.readText();
    const text = res && res.found ? (res.text || "") : "";
    if (!text || text.trim() === "") return { skipped: "empty" };

    // 与最近一条比对去重（剪贴板没变就别重复入库）。
    const recent = aglet.data.list(APP_ID, "clips", {
      orderBy: [{ field: "ts", direction: "desc" }],
      limit: 1,
    });
    const last = recent.items && recent.items[0];
    if (last && last.data.text === text) return { dup: true };

    aglet.data.create(APP_ID, "clips", { text, ts: Date.now(), pinned: false });

    // 裁剪：非置顶超过上限 → 删最旧。
    const unpinned = aglet.data.list(APP_ID, "clips", {
      where: { pinned: false },
      orderBy: [{ field: "ts", direction: "desc" }],
      limit: 500,
    });
    const items = unpinned.items || [];
    for (let i = MAX_UNPINNED; i < items.length; i++) {
      aglet.data.delete(APP_ID, "clips", items[i].id);
    }
    return { added: true };
  },

  // 行点击：把该条写回剪贴板（= 重新复制）。
  async copy({ id }, { plugins }) {
    const row = aglet.data.get(APP_ID, "clips", id);
    const text = row && row.data ? row.data.text : "";
    if (text) await plugins.clipboard.writeText({ text });
    return { copied: !!text };
  },

  // 置顶/取消置顶（需读当前值翻转）。
  async togglePin({ id }) {
    const row = aglet.data.get(APP_ID, "clips", id);
    const pinned = row && row.data ? !!row.data.pinned : false;
    aglet.data.update(APP_ID, "clips", id, { pinned: !pinned });
    return { pinned: !pinned };
  },
};
