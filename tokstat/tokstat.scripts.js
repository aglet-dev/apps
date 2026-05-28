// tokstat scripts.js — render Claude + Codex session + weekly usage.
//
// The `tokstat` stdio plugin pushes a `sample` notification roughly
// once a minute. payload.contents shape:
//   { ts, claude:{ok, session:{used_pct, resets_at_raw, resets_at_ms},
//                  weekly:{...}, total_cost_usd},
//     codex:{ok, session:{...}, weekly:{...}, plan_type} }
// Claude 走 PTY 起 CLI（昂贵）；codex 直接读 ~/.codex/sessions rollout JSONL
// （便宜）。两边都不准时 emit ok=false + error 字段。

function pctText(pct) {
  return typeof pct === "number" ? `${pct}%` : "—";
}

function pctShort(pct) {
  return typeof pct === "number" ? `${pct}` : "—";
}

function untilText(ms) {
  if (typeof ms !== "number") return null;
  let s = Math.max(0, Math.round((ms - Date.now()) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h < 48) return mm > 0 ? `${h}h${mm}m` : `${h}h`;
  return `${Math.floor(h / 24)}d${h % 24}h`;
}

function resetLine(raw, ms) {
  const until = untilText(ms);
  if (until && raw) return `in ${until} · ${raw}`;
  if (until) return `in ${until}`;
  if (typeof ms === "number" && ms > 0) {
    // codex 没 raw 文本，只给 epoch ms —— 转 wall-clock 显示用本地时区。
    const d = new Date(ms);
    return `in ${until} · ${d.toLocaleString()}`;
  }
  return raw || "—";
}

// menubar 两行：左对齐 prefix（CL/CX）+ 等宽数字。Swift applyMenubarTitle
// 见到 \n 切到 attributedTitle (10pt monospaced digit, 右对齐, 紧凑行距)。
function menubarLine(prefix, sPct, wPct) {
  return `${prefix} ${pctShort(sPct)}·${pctShort(wPct)}`;
}

export default {
  async onSample(payload, ctx) {
    const sample = payload?.contents ?? {};
    const claude = sample.claude ?? {};
    const codex = sample.codex ?? {};

    const cSess = claude.session ?? {};
    const cWeek = claude.weekly ?? {};
    const cOk = claude.ok === true;
    const cSp = cSess.used_pct;
    const cWp = cWeek.used_pct;
    const cost = typeof claude.total_cost_usd === "number" ? claude.total_cost_usd : null;

    const xSess = codex.session ?? {};
    const xWeek = codex.weekly ?? {};
    const xOk = codex.ok === true;
    const xSp = xSess.used_pct;
    const xWp = xWeek.used_pct;
    const xPlan = typeof codex.plan_type === "string" ? codex.plan_type : null;
    const xSource = typeof codex.source === "string" ? codex.source : "";
    const xCredits = codex.credits ?? {};
    const xCredBalance = typeof xCredits.balance === "string" ? xCredits.balance : null;
    const xCredUnlim = xCredits.unlimited === true;

    // Data 链路：claude 和 codex 各落一条 samples row（同 schema，按 source 区分）。
    // 失败侧（ok=false）跳，避免空 row 污染 sparkline。
    function persist(source, ok, sPct, wPct, sMs, wMs) {
      if (!ok) return;
      try {
        ctx.dispatch("data.create", {
          collection: "samples",
          data: {
            ts: typeof sample.ts === "number" ? sample.ts : Date.now(),
            source,
            ok,
            session_pct: typeof sPct === "number" ? sPct : 0,
            weekly_pct: typeof wPct === "number" ? wPct : 0,
            session_resets_ms: typeof sMs === "number" ? sMs : 0,
            weekly_resets_ms: typeof wMs === "number" ? wMs : 0,
            total_cost_usd: source === "claude" ? (cost ?? 0) : 0,
          },
        });
      } catch (e) {
        console.warn(`[tokstat] data.create(${source}) failed:`, e);
      }
    }
    persist("claude", cOk, cSp, cWp, cSess.resets_at_ms, cWeek.resets_at_ms);
    persist("codex", xOk, xSp, xWp, xSess.resets_at_ms, xWeek.resets_at_ms);

    // State 链路：menubar 两行 + popover 两 block。Tray walker 把 menubar_title
    // 推到 NSStatusItem（多行 → attributedTitle 10pt mono right-aligned）。
    const lines = [];
    if (cOk) lines.push(menubarLine("CL", cSp, cWp));
    else lines.push("CL ?");
    if (xOk) lines.push(menubarLine("CX", xSp, xWp));
    else lines.push("CX ?");

    // 注：*_bar (ASCII) 字段已删 —— UI 现在用 <Chart kind="bar"> 直接订阅
    // samples collection 渲染，不再走 state 镜像。当前百分比 / reset 文字仍
    // 走 state（Chart 显示历史，文字显示 current value + 下次 reset 时间）。
    ctx.setState({
      // Claude
      claude_ok: cOk,
      claude_err: cOk ? "" : claude.error || "no data",
      claude_session_pct_text: pctText(cSp),
      claude_session_reset_text: resetLine(cSess.resets_at_raw, cSess.resets_at_ms),
      claude_weekly_pct_text: pctText(cWp),
      claude_weekly_reset_text: resetLine(cWeek.resets_at_raw, cWeek.resets_at_ms),
      claude_cost_text: cost !== null ? `$${cost.toFixed(4)}` : "—",

      // Codex
      codex_ok: xOk,
      codex_err: xOk ? "" : codex.error || "no data",
      codex_session_pct_text: pctText(xSp),
      codex_session_reset_text: resetLine(null, xSess.resets_at_ms),
      codex_weekly_pct_text: pctText(xWp),
      codex_weekly_reset_text: resetLine(null, xWeek.resets_at_ms),
      codex_plan_text: xPlan ? xPlan : "—",
      codex_source_text: xSource ? xSource : "—",
      codex_credits_text: xCredUnlim ? "unlimited" : (xCredBalance != null ? `$${xCredBalance}` : "—"),

      // Menubar combined
      menubar_title: lines.join("\n"),
    });
  },
};
