// Memory Monitor —— 1Hz interval 采 memory bytes，写 metrics + state.* 让 UI 绑定。

const APP_ID = "sysmon-mem";

export default {
  async collectMem(_, ctx) {
    const mem = await ctx.plugins.sysinfo.memory();
    const memUsedGB = mem.used_bytes / 1e9;
    const memTotalGB = mem.total_bytes / 1e9;
    const memPct = mem.total_bytes > 0 ? (mem.used_bytes / mem.total_bytes) * 100 : 0;
    await ctx.dispatch("data.create", {
      collection: "metrics",
      data: {
        ts: Date.now(),
        mem_pct: memPct,
        mem_used: mem.used_bytes,
        mem_total: mem.total_bytes,
      },
    });
    ctx.setState({
      mem_text: `${memUsedGB.toFixed(1)} / ${memTotalGB.toFixed(1)} GB`,
      mem_pct_text: `${memPct.toFixed(0)}%`,
      menubar_title: `${memPct.toFixed(0)}%`,
    });
  },
};
