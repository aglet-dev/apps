// sysmon scripts.js —— scheduler-driven 单次采样
//
// 1Hz interval job + while:"window_open" → scheduler 在窗口存活时调
// collectMetrics 一次/秒；background 自动停采。
//
// 数据源走 `sysmon` stdio plugin（长寿命 zig 子进程，macOS Mach API、
// 跨调用持 prior-tick CPU 状态）。一次 sysmon.snapshot 拿齐 cpu/memory/disk，
// 比拆两次 cpu+memory call 省一次 IPC round-trip。

export default {
  async collectMetrics(_, ctx) {
    const snap = await ctx.plugins.sysmon.snapshot();
    const cpuPct = snap.cpu.used_pct;
    const memUsedGB = snap.memory.used_bytes / 1e9;
    const memTotalGB = snap.memory.total_bytes / 1e9;
    const memPct = snap.memory.used_pct;
    await ctx.dispatch("data.create", {
      collection: "metrics",
      data: {
        ts: Date.now(),
        cpu_pct: cpuPct,
        mem_used: snap.memory.used_bytes,
        mem_total: snap.memory.total_bytes,
      },
    });
    // Phase C：<TrayLabel> 内 <Text> 绑 state.menubar_title。setState 更新触发
    // emitStateChanged event mirror → React re-render → Tray useEffect 检 title
    // 变化 → dispatch tray.upsert → native NSStatusItem.button title 实时更新。
    // 无活窗口时 session_id=0，setState 自动 no-op（scripts.zig prelude 保护）。
    ctx.setState({
      cpu_text: `${cpuPct.toFixed(1)}%`,
      mem_text: `${memUsedGB.toFixed(1)} / ${memTotalGB.toFixed(1)} GB`,
      mem_pct_text: `${memPct.toFixed(0)}%`,
      menubar_title: `CPU ${cpuPct.toFixed(0)}%\nMEM ${memPct.toFixed(0)}%`,
    });
  },
};
