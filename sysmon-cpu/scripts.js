// CPU Monitor —— 1Hz interval 采 cpu pct，写 metrics + state.cpu_text /
// state.menubar_title 让 TrayLabel <Text> 绑定实时显示。

const APP_ID = "sysmon-cpu";

export default {
  async collectCpu(_, ctx) {
    const cpu = await ctx.plugins.sysinfo.cpu();
    const cpuPct = cpu.used_pct;
    await ctx.dispatch("data.create", {
      collection: "metrics",
      data: { ts: Date.now(), cpu_pct: cpuPct },
    });
    ctx.setState({
      cpu_text: `${cpuPct.toFixed(1)}%`,
      menubar_title: `${cpuPct.toFixed(0)}%`,
    });
  },
};
