// 汇率 + 利润计算。
//
// fetchRates(): 拉 exchangerate-api 的 USD-base 表，存到 state.rates_json。
// calc(): 拿当前 form (cost / cost_ccy / price / price_ccy / fees_pct)
//   → 换算成同一币种（默认 base=cost_ccy），算利润 + 利润率。
// 没汇率表时 calc 会提示先 "刷新汇率"。

const RATES_URL = "https://api.exchangerate-api.com/v4/latest/USD";

export default {
  async fetchRates(_args, { setState }) {
    setState({ loading: true, error: "" });
    try {
      const r = await fetch(RATES_URL);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setState({
        rates_json: JSON.stringify(j.rates || {}),
        rates_at: j.date || new Date().toISOString().slice(0, 10),
        loading: false,
      });
    } catch (e) {
      setState({ error: String(e.message || e), loading: false });
    }
  },

  calc(args = {}, { setState, scope }) {
    const cost = Number(args.cost) || 0;
    const price = Number(args.price) || 0;
    const fees = Number(args.fees_pct) || 0;
    const cc = (args.cost_ccy || "USD").toUpperCase();
    const pc = (args.price_ccy || "USD").toUpperCase();

    if (cost <= 0 || price <= 0) {
      setState({ error: "成本和售价都要 > 0", result: "" });
      return;
    }
    const ratesStr = scope?.state?.rates_json || "";
    if (!ratesStr) {
      setState({ error: "请先 '刷新汇率'", result: "" });
      return;
    }
    let rates;
    try { rates = JSON.parse(ratesStr); } catch { rates = {}; }
    // 全部换成 USD 算
    const toUsd = (amt, c) => {
      if (c === "USD") return amt;
      const r = rates[c];
      if (!r) throw new Error(`未找到 ${c} 汇率`);
      return amt / r;
    };
    try {
      const costUsd = toUsd(cost, cc);
      const priceUsd = toUsd(price, pc);
      const netPriceUsd = priceUsd * (1 - fees / 100);
      const profitUsd = netPriceUsd - costUsd;
      const marginPct = (profitUsd / priceUsd) * 100;
      const f = (n) => n.toFixed(2);
      const lines = [
        `成本：${cost} ${cc} (= ${f(costUsd)} USD)`,
        `售价：${price} ${pc} (= ${f(priceUsd)} USD)`,
        fees > 0 ? `扣除手续费 ${fees}%：净售价 ${f(netPriceUsd)} USD` : null,
        `利润：${f(profitUsd)} USD`,
        `利润率：${f(marginPct)}%`,
      ].filter(Boolean);
      setState({ result: lines.join("\n"), error: "" });
    } catch (e) {
      setState({ error: String(e.message || e), result: "" });
    }
  },

  clear(_args, { setState }) {
    setState({ result: "", error: "" });
  },
};
