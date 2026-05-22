// sysmon scripts.js —— scheduler-driven 单次采样
//
// 旧形态：Page onEnter 起 setInterval、onLeave clearInterval。
// 新形态：manifest.jobs 声明 1Hz interval job + while:"window_open"
//        → scheduler 自动按窗口存活态调用 collectMetrics 一次一条。
// 好处：循环逻辑下沉到 runtime；Page UI 纯展示，不再持 timer 状态；
//      while:"window_open" 让 background 时停采，省 CPU。

export default {
  async collectMetrics(_, ctx) {
    const cpu = await ctx.plugins.sysinfo.cpu();
    const mem = await ctx.plugins.sysinfo.memory();
    const cpuPct = cpu.used_pct;
    const memUsedGB = mem.used_bytes / 1e9;
    const memTotalGB = mem.total_bytes / 1e9;
    const memPct = mem.total_bytes > 0 ? (mem.used_bytes / mem.total_bytes) * 100 : 0;
    await ctx.dispatch("data.create", {
      collection: "metrics",
      data: {
        ts: Date.now(),
        cpu_pct: cpuPct,
        mem_used: mem.used_bytes,
        mem_total: mem.total_bytes,
      },
    });
    // iStat-style live title (Phase 2)：NSStatusItem 上显示 CPU%。
    // 非 menubar style 调用 host noop —— 跨 style 共用同份 scripts.js 安全。
    await ctx.dispatch("window.setMenubarTitle", {
      title: `CPU ${cpuPct.toFixed(0)}%`,
    });
    // Phase 3：popover UI 紧凑行靠 state 绑定，setState 让上方 3 行 live 更新。
    // 无活窗口时 session_id=0，setState 自动 no-op（scripts.zig prelude 保护）。
    ctx.setState({
      cpu_text: `${cpuPct.toFixed(1)}%`,
      mem_text: `${memUsedGB.toFixed(1)} / ${memTotalGB.toFixed(1)} GB`,
      mem_pct_text: `${memPct.toFixed(0)}%`,
    });
  },
  // Phase C6 event-bus demo：sysinfo.cpu() 每次采样后 emit sysinfo.cpu_sampled，
  // 该 handler 被 plugin_events dispatcher 触发。**不可调 sysinfo.cpu** —— 否则
  // emit → handler → emit 死循环。ctx.scope 携带 {event, source} 元信息。
  async onCpuSampled(_, ctx) {
    await ctx.dispatch("data.create", {
      collection: "events",
      data: { ts: Date.now(), event: ctx.scope.event || "" },
    });
  },
};
