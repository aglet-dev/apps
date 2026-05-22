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
    await ctx.dispatch("data.create", {
      collection: "metrics",
      data: {
        ts: Date.now(),
        cpu_pct: cpu.used_pct,
        mem_used: mem.used_bytes,
        mem_total: mem.total_bytes,
      },
    });
    // iStat-style menubar live title (Phase 2)：CPU% 直接显示在 NSStatusItem。
    // 非 menubar style 调用 host noop —— 跨 style 共用同份 scripts.js 安全。
    await ctx.dispatch("window.setMenubarTitle", {
      title: `CPU ${cpu.used_pct.toFixed(0)}%`,
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
