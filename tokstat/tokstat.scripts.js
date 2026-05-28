// tokstat scripts.js — render Claude session + weekly usage.
//
// The `tokstat` stdio plugin pushes a `sample` notification roughly
// once a minute (each probe spawns the `claude` CLI in a PTY, so this
// is heavier than CPU sampling — the plugin enforces a 30s floor).

function bar(pct, width = 16) {
  if (typeof pct !== "number" || !isFinite(pct)) return "─".repeat(width);
  const filled = Math.max(0, Math.min(width, Math.round((pct / 100) * width)));
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function pctText(pct) {
  return typeof pct === "number" ? `${pct}%` : "—";
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
  return raw || "—";
}

export default {
  async onSample(payload, ctx) {
    const sample = payload?.contents ?? {};
    const claude = sample.claude ?? {};
    const session = claude.session ?? {};
    const weekly = claude.weekly ?? {};
    const ok = claude.ok === true;

    const sPct = session.used_pct;
    const wPct = weekly.used_pct;
    const cost = typeof claude.total_cost_usd === "number" ? claude.total_cost_usd : null;

    // Data 链路：落 SQLite samples 集合给历史回看 / 未来 Sparkline。
    // schema 见 manifest.collections.samples（storage:persistent）。
    if (ok) {
      try {
        ctx.dispatch("data.create", {
          collection: "samples",
          data: {
            ts: typeof sample.ts === "number" ? sample.ts : Date.now(),
            ok,
            session_pct: typeof sPct === "number" ? sPct : 0,
            weekly_pct: typeof wPct === "number" ? wPct : 0,
            session_resets_ms: typeof session.resets_at_ms === "number" ? session.resets_at_ms : 0,
            weekly_resets_ms: typeof weekly.resets_at_ms === "number" ? weekly.resets_at_ms : 0,
            total_cost_usd: cost ?? 0,
          },
        });
      } catch (e) {
        console.warn("[tokstat] data.create failed:", e);
      }
    }

    // State 链路：刷 app state 给 menubar label / popover 当前值。Tray walker
    // 自动 dispatch tray.upsert 把 menubar_title 推到 NSStatusItem。
    ctx.setState({
      ok,
      error_text: ok ? "" : claude.error || "no data",
      session_pct_text: pctText(sPct),
      session_bar: bar(sPct),
      session_reset_text: resetLine(session.resets_at_raw, session.resets_at_ms),
      weekly_pct_text: pctText(wPct),
      weekly_bar: bar(wPct),
      weekly_reset_text: resetLine(weekly.resets_at_raw, weekly.resets_at_ms),
      cost_text: cost !== null ? `$${cost.toFixed(4)}` : "—",
      menubar_title: ok
        ? `S ${pctText(sPct)} · W ${pctText(wPct)}`
        : "Claude · ?",
    });
  },
};
