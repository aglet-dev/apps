// tokstat scripts.js — Claude + Codex token usage.
//
// DATA_FLOW.md 数据流：plugin sample (数据源) → SQLite → UI。
//   - `samples` (persistent)：每拍 append 原始数字 → Sparkline/Chart 历史。
//   - `current`  (memory, upsert by source)：每 source 一行「最新快照」，携带
//     popover/menubar 要显示的全部字段 → popover/TrayLabel 经 <DataScope> 读
//     /data/<as>。订阅自带首屏 snapshot → 冷启动即有真值。
// ❌ 不再 ctx.setState 任何展示值（消除 数据源→state→UI 捷径）。
//
// plugin `sample` payload.contents:
//   { ts, claude:{ok, session:{used_pct,resets_at_raw,resets_at_ms}, weekly:{...}, total_cost_usd},
//         codex:{ok, source, session:{...}, weekly:{...}, plan_type, credits:{...}} }

function pctText(pct) {
  return typeof pct === "number" ? `${pct}%` : "—";
}

function pctShort(pct) {
  return typeof pct === "number" ? `${pct}` : "?";
}

function pctColor(pct) {
  if (typeof pct !== "number") return "default";
  if (pct >= 95) return "danger";
  if (pct >= 80) return "warning";
  return "primary";
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
    const d = new Date(ms);
    return d.toLocaleString();
  }
  return raw || "—";
}

// 一个 sample（{claude, codex, ts?}）→ current(每 source 最新快照) + samples(历史)。
// onSample(plugin 事件) 和 refreshNow(右键菜单手动刷) 共用。
async function processSample(sample, ctx) {
    const ts = typeof sample.ts === "number" ? sample.ts : Date.now();

    // 把一侧（claude/codex）算成 `current` 行（全字段）+ `samples` 行（原始数字）。
    async function ingest(source, side, extra) {
      const ok = side.ok === true;
      const sess = side.session ?? {};
      const week = side.weekly ?? {};
      const sPct = sess.used_pct;
      const wPct = week.used_pct;

      // current：最新快照（展示就绪 + 原始 pct 给 Progress value），按 source upsert。
      const row = {
        source,
        ts,
        ok,
        err: ok ? "" : (side.error || "no data"),
        menu_text: `${pctShort(sPct)}·${pctShort(wPct)}`,
        session_pct: typeof sPct === "number" ? sPct : 0,
        session_pct_text: pctText(sPct),
        session_color: pctColor(sPct),
        session_reset_text: resetLine(sess.resets_at_raw ?? null, sess.resets_at_ms),
        weekly_pct: typeof wPct === "number" ? wPct : 0,
        weekly_pct_text: pctText(wPct),
        weekly_color: pctColor(wPct),
        weekly_reset_text: resetLine(week.resets_at_raw ?? null, week.resets_at_ms),
        cost_text: extra.cost_text ?? "",
        plan_text: extra.plan_text ?? "",
        source_text: extra.source_text ?? "",
        credits_text: extra.credits_text ?? "",
      };
      try {
        await ctx.dispatch("data.upsert", { collection: "current", by_field: "source", data: row });
      } catch (e) {
        console.warn(`[tokstat] upsert current(${source}) failed:`, e);
      }

      // samples：仅 ok 行 append 原始数字，喂 Sparkline/Chart。
      if (ok) {
        try {
          await ctx.dispatch("data.create", {
            collection: "samples",
            data: {
              ts,
              source,
              ok,
              session_pct: typeof sPct === "number" ? sPct : 0,
              weekly_pct: typeof wPct === "number" ? wPct : 0,
              session_resets_ms: typeof sess.resets_at_ms === "number" ? sess.resets_at_ms : 0,
              weekly_resets_ms: typeof week.resets_at_ms === "number" ? week.resets_at_ms : 0,
              total_cost_usd: typeof extra.cost_usd === "number" ? extra.cost_usd : 0,
            },
          });
        } catch (e) {
          console.warn(`[tokstat] data.create samples(${source}) failed:`, e);
        }
      }
    }

    const claude = sample.claude ?? {};
    const cost = typeof claude.total_cost_usd === "number" ? claude.total_cost_usd : null;
    await ingest("claude", claude, {
      cost_text: cost !== null ? `$${cost.toFixed(4)}` : "—",
      cost_usd: cost ?? 0,
    });

    const codex = sample.codex ?? {};
    const xc = codex.credits ?? {};
    const credits_text = xc.unlimited === true
      ? "unlimited"
      : (typeof xc.balance === "string" ? `$${xc.balance}` : "—");
    await ingest("codex", codex, {
      plan_text: typeof codex.plan_type === "string" ? codex.plan_type : "—",
      source_text: typeof codex.source === "string" ? codex.source : "—",
      credits_text,
    });
}

export default {
  async onSample(payload, ctx) {
    await processSample(payload?.contents ?? {}, ctx);
  },
  // 右键菜单 "Refresh now"（<TrayMenuItem onSelect="refreshNow">）→ bg handler（无 webview）。
  // 立即跑一次探针（plugin refresh action 返回 {claude, codex}）并入库。授权靠 app 的
  // manifest.requires:[{plugin:"tokstat"}]（plugin 权限模型 ③）—— 不需要 app 声明 exec:fork。
  async refreshNow(_payload, ctx) {
    try {
      const data = await ctx.plugins.tokstat.refresh();
      if (data) await processSample(data, ctx);
    } catch (e) {
      console.warn("[tokstat] refreshNow failed:", String(e));
    }
  },
};
