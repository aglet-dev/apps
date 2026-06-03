// sysmon scripts.js —— event-driven 系统监控采样
//
// `sysmon` stdio 插件每 1s 推一条 `cpu` notification；host 经 `sysmon.cpu`
// 事件 fan-out 到 onCpuSample。CPU notification 只带 CPU 字段，其余每 tick
// 显式拉：memory / disk(/) / gpu / battery（都是便宜的 syscall / IOKit 读）。

// 利用率 → color token（绿<60，黄<85，红≥85）。
function pctColor(p) {
  if (p >= 85) return "danger";
  if (p >= 60) return "warning";
  return "success";
}
// 温度 → color（<60℃ 绿，<80℃ 黄，≥80℃ 红）。
function tempColor(c) {
  if (c >= 80) return "danger";
  if (c >= 60) return "warning";
  return "success";
}
const fmtGB = (bytes) => (bytes / 1e9).toFixed(1);
// bytes/sec → 人读速率（<1MB/s 用 KB/s，否则 MB/s）。
const fmtRate = (bps) =>
  bps >= 1048576 ? `${(bps / 1048576).toFixed(1)} MB/s` : `${(bps / 1024).toFixed(0)} KB/s`;

export default {
  async onCpuSample(payload, ctx) {
    const cpu = payload?.contents ?? {};
    const cpuPct = cpu.used_pct ?? 0;

    const mem = await ctx.plugins.sysmon.memory();
    const memPct = mem.used_pct ?? 0;

    const disk = await ctx.plugins.sysmon.disk({ path: "/" });
    const diskPct = disk.used_pct ?? 0;

    const gpu = await ctx.plugins.sysmon.gpu();
    const gpuPct = gpu.util_pct ?? 0;

    const batt = await ctx.plugins.sysmon.battery();

    // 温度（私有 IOHID）/ 风扇（SMC）。无传感器/无风扇机型 → present=false 优雅降级。
    const temp = await ctx.plugins.sysmon.temp();
    const tempC = temp.present ? (temp.cpu_c || temp.max_c) : 0;

    const fan = await ctx.plugins.sysmon.fan();

    // 网络：interface 累计 bytes → 插件内部按上次采样差出 bytes/sec。
    const net = await ctx.plugins.sysmon.network();
    const rxBps = net.rx_bytes_per_sec ?? 0;
    const txBps = net.tx_bytes_per_sec ?? 0;

    await ctx.dispatch("data.create", {
      collection: "metrics",
      data: {
        ts: Date.now(),
        cpu_pct: cpuPct,
        mem_used: mem.used_bytes,
        mem_total: mem.total_bytes,
        disk_pct: diskPct,
        gpu_pct: gpuPct,
        temp_c: tempC,
        rx_kbps: rxBps / 1024,
        tx_kbps: txBps / 1024,
      },
    });

    // 电池：充电 → primary，低电 → danger，无电池(台式) → secondary + "—"。
    const battText = batt.present
      ? `${batt.percent.toFixed(0)}%${batt.charging ? " ⚡" : ""}`
      : "—";
    const battColor = !batt.present
      ? "secondary"
      : batt.charging
        ? "primary"
        : batt.percent <= 20
          ? "danger"
          : "success";

    ctx.setState({
      cpu_text: `${cpuPct.toFixed(1)}%`,
      cpu_pct: cpuPct,
      cpu_color: pctColor(cpuPct),

      mem_text: `${fmtGB(mem.used_bytes)} / ${fmtGB(mem.total_bytes)} GB`,
      mem_pct: memPct,
      mem_color: pctColor(memPct),

      disk_text: `${fmtGB(disk.used_bytes)} / ${fmtGB(disk.total_bytes)} GB`,
      disk_pct: diskPct,
      disk_color: pctColor(diskPct),

      gpu_text: `${gpuPct.toFixed(0)}%`,
      gpu_pct: gpuPct,
      gpu_color: pctColor(gpuPct),

      batt_present: batt.present,
      batt_text: battText,
      batt_pct: batt.present ? batt.percent : 0,
      batt_color: battColor,

      temp_present: temp.present,
      temp_text: temp.present ? `${tempC.toFixed(0)}°C` : "—",
      temp_pct: temp.present ? tempC : 0,
      temp_color: tempColor(tempC),

      fan_present: fan.present,
      fan_text: fan.present ? `${Math.round(fan.rpm)} rpm` : "—",

      net_rx_text: fmtRate(rxBps),
      net_tx_text: fmtRate(txBps),

      menubar_title:
        `CPU ${cpuPct.toFixed(0)}%\nMEM ${memPct.toFixed(0)}%` +
        (temp.present ? `\nTEMP ${tempC.toFixed(0)}°C` : "") +
        (batt.present ? `\nBAT ${batt.percent.toFixed(0)}%` : ""),
    });
  },
};
