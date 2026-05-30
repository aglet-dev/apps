// sysmon scripts.js —— event-driven CPU sampling
//
// The `sysmon` stdio plugin pushes a `cpu` notification every 1s; the host
// fans it out to the `onCpuSample` handler via the `sysmon.cpu` event.
// Memory is pulled once per tick by an explicit plugin call (the CPU
// notification only carries CPU fields).

export default {
  async onCpuSample(payload, ctx) {
    const cpu = payload?.contents ?? {};
    const cpuPct = cpu.used_pct ?? 0;
    const mem = await ctx.plugins.sysmon.memory();
    const memUsedGB = mem.used_bytes / 1e9;
    const memTotalGB = mem.total_bytes / 1e9;
    const memPct = mem.used_pct;
    await ctx.dispatch("data.create", {
      collection: "metrics",
      data: {
        ts: Date.now(),
        cpu_pct: cpuPct,
        mem_used: mem.used_bytes,
        mem_total: mem.total_bytes,
      },
    });
    ctx.setState({
      cpu_text: `${cpuPct.toFixed(1)}%`,
      mem_text: `${memUsedGB.toFixed(1)} / ${memTotalGB.toFixed(1)} GB`,
      mem_pct_text: `${memPct.toFixed(0)}%`,
      menubar_title: `CPU ${cpuPct.toFixed(0)}%\nMEM ${memPct.toFixed(0)}%`,
    });
  },
};
