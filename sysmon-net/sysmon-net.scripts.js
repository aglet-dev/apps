// Network Monitor —— 1Hz interval 采网卡 rx/tx bytes/sec，写 metrics + state。
// sysinfo.network 内部维护上次累计 bytes + 时间戳，第二次起返 rate (bytes/s)。

const APP_ID = "sysmon-net";

function formatRate(bps) {
  if (bps < 1024) return `${bps.toFixed(0)} B/s`;
  if (bps < 1024 * 1024) return `${(bps / 1024).toFixed(1)} K/s`;
  return `${(bps / 1024 / 1024).toFixed(2)} M/s`;
}

export default {
  async collectNet(_, ctx) {
    const net = await ctx.plugins.sysinfo.network();
    const rxBps = net.rx_bytes_per_sec;
    const txBps = net.tx_bytes_per_sec;
    await ctx.dispatch("data.create", {
      collection: "metrics",
      data: {
        ts: Date.now(),
        rx_kbps: rxBps / 1024,
        tx_kbps: txBps / 1024,
      },
    });
    ctx.setState({
      rx_text: formatRate(rxBps),
      tx_text: formatRate(txBps),
      // menubar 双行：↓ down / ↑ up
      menubar_title: `↓${formatRate(rxBps)}\n↑${formatRate(txBps)}`,
    });
  },
};
