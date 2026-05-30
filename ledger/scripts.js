// 汇总当月收支 + 按 category 分组。
//
// 入口 refresh(args, {dispatch, setState})：
//   - dispatch("data.list", {collection:"entries", query:{...}}) 拿当月条目
//   - 算 income/expense/by_category
//   - setState 写回 state，UI 渲染

function ymOf(date) {
  // "2026-05-16T..." 或 "2026-05-16 ..." → "2026-05"
  return String(date || "").slice(0, 7);
}

export default {
  async refresh(_args, { setState, dispatch }) {
    const now = new Date();
    const ym = now.toISOString().slice(0, 7);

    const res = await dispatch("data.list", {
      collection: "entries",
      query: { limit: 500 },
    });
    const items = (res?.items ?? []).map(r => r.data);
    const month = items.filter(d => ymOf(d.date) === ym);

    let income = 0, expense = 0;
    const byCat = {};
    for (const e of month) {
      const amt = Number(e.amount) || 0;
      if (e.kind === "income") income += amt;
      else expense += amt;
      const cat = e.category || "其它";
      byCat[cat] = (byCat[cat] || 0) + (e.kind === "income" ? amt : -amt);
    }

    const lines = Object.entries(byCat)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .map(([cat, v]) => `${cat}: ${v >= 0 ? "+" : ""}${v.toFixed(2)}`)
      .join("\n");

    setState({
      month_income: income,
      month_expense: expense,
      // 空时由 UI 端按 locale 显示 t.summaryEmpty —— 不在脚本里硬编码语言
      by_category: lines,
    });
  },
};
