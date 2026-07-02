// tokstat scripts.js — Claude + Codex token usage.
//
// 数据流：refresh job → 读凭据(aicreds 插件) → app 内 HTTP 拉各家用量 → SQLite → UI。
//   - HTTP 全在这里：Claude `api.anthropic.com/api/oauth/usage`、
//     Codex `chatgpt.com/backend-api/wham/usage`。凭据(会自动续期的 OAuth
//     access token)由只读插件 `aicreds` 从 Keychain / ~/.codex/auth.json 取。
//   - `samples` (persistent)：每拍 append 原始数字 → Sparkline/Chart 历史。
//   - `current`  (persistent, upsert by source)：每 source 一行「最新快照」，
//     携带 popover/menubar 要显示的全部字段 → popover/TrayLabel 经 <DataScope>
//     读 /data/<as>。
//   - 瞬时失败(429 / 网断)那一侧**不写**，保留上一次真值(不抹成 "…")。
//   - 不再有 CLI/PTY 兜底：HTTP 失败就是失败。

const APP_ID = "tokstat";

// ── 展示格式化(与数据来源无关，原样保留) ──────────────────────────────────

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

// ── 凭据 + HTTP 探测 ───────────────────────────────────────────────────────

// aicreds 插件：只读凭据 → { access_token, account_id? }。读不到(未登录)返回
// { access_token:"" }。任何异常按未登录处理。
async function readCred(ctx, provider) {
  try {
    const c = await ctx.plugins.aicreds.read({ provider });
    if (c && typeof c.access_token === "string" && c.access_token) return c;
    return null;
  } catch (e) {
    console.warn(`[tokstat] aicreds.read(${provider}) failed:`, String(e));
    return null;
  }
}

// 统一 fetch：返回 { ok:true, data } / { transient:true } / { needs_auth:true }。
// 429 / 非 2xx / 网断 / body 非预期 一律 transient(调用方保留上次值)。
function getJson(url, headers) {
  let r;
  try {
    r = fetch(url, { headers });
  } catch (e) {
    console.warn(`[tokstat] fetch ${url} threw:`, String(e));
    return { transient: true };
  }
  if (r.status === 429 || !r.ok) {
    return { transient: true, status: r.status };
  }
  let d;
  try { d = r.json(); } catch (_e) { return { transient: true }; }
  if (!d || d.error) return { transient: true };
  return { ok: true, data: d };
}

// Claude window：{ utilization(%), resets_at(ISO) } → { used_pct, resets_at_ms }。
function claudeWindow(w) {
  if (!w) return {};
  const pct = typeof w.utilization === "number" ? Math.round(w.utilization) : undefined;
  const ms = typeof w.resets_at === "string" ? Date.parse(w.resets_at) : NaN;
  return {
    used_pct: pct,
    resets_at_ms: Number.isFinite(ms) ? ms : undefined,
    resets_at_raw: null,
  };
}

function fetchClaude(cred) {
  if (!cred) return { needs_auth: true };
  const res = getJson("https://api.anthropic.com/api/oauth/usage", {
    Authorization: "Bearer " + cred.access_token,
    Accept: "application/json",
    "User-Agent": "tokstat",
  });
  if (!res.ok) return res;
  const d = res.data;
  if (!d.five_hour && !d.seven_day) return { transient: true };
  return {
    ok: true,
    session: claudeWindow(d.five_hour),
    weekly: claudeWindow(d.seven_day),
    total_cost_usd: null, // 该端点不含 cost
  };
}

// Codex window：{ used_percent(%), reset_at|resets_at(epoch 秒) } → { used_pct, resets_at_ms }。
function codexWindow(w) {
  if (!w) return {};
  const pct = typeof w.used_percent === "number" ? Math.round(w.used_percent) : undefined;
  const secs = typeof w.reset_at === "number" ? w.reset_at
    : (typeof w.resets_at === "number" ? w.resets_at : undefined);
  return {
    used_pct: pct,
    resets_at_ms: secs !== undefined ? secs * 1000 : undefined,
    resets_at_raw: null,
  };
}

function fetchCodex(cred) {
  if (!cred) return { needs_auth: true };
  const headers = {
    Authorization: "Bearer " + cred.access_token,
    Accept: "application/json",
    "User-Agent": "tokstat",
  };
  if (cred.account_id) headers["ChatGPT-Account-Id"] = cred.account_id;
  const res = getJson("https://chatgpt.com/backend-api/wham/usage", headers);
  if (!res.ok) return res;
  const d = res.data;
  const rl = d.rate_limit;
  if (!rl) return { transient: true };
  const cr = d.credits || {};
  const balance = typeof cr.balance === "number" ? cr.balance.toFixed(2)
    : (typeof cr.balance === "string" ? cr.balance : undefined);
  return {
    ok: true,
    source: "http",
    session: codexWindow(rl.primary_window),
    weekly: codexWindow(rl.secondary_window),
    plan_type: typeof d.plan_type === "string" ? d.plan_type : undefined,
    credits: { unlimited: cr.unlimited === true, balance, has_credits: cr.has_credits === true },
  };
}

// ── 入库(每 source 最新快照 + 历史) ──────────────────────────────────────

// sample = { ts?, claude?, codex? }。只写「存在的一侧」——瞬时失败的一侧不传，
// 保留 current 里的上一次真值(不抹成 "?·?"/"…")。
async function processSample(sample, ctx) {
  const ts = typeof sample.ts === "number" ? sample.ts : (ctx.now ? ctx.now() : Date.now());

  async function ingest(source, side, extra) {
    const ok = side.ok === true;
    const sess = side.session ?? {};
    const week = side.weekly ?? {};
    const sPct = sess.used_pct;
    const wPct = week.used_pct;

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

  if (sample.claude) {
    const claude = sample.claude;
    const cost = typeof claude.total_cost_usd === "number" ? claude.total_cost_usd : null;
    await ingest("claude", claude, {
      cost_text: cost !== null ? `$${cost.toFixed(4)}` : "—",
      cost_usd: cost ?? 0,
    });
  }

  if (sample.codex) {
    const codex = sample.codex;
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

  syncShowFlags(ctx);
}

// Display filter (settings.show = both|claude|codex) → 正向布尔 state，给 popover
// 区块可见性用。菜单栏 TrayLabel 走服务端 op:ne 过滤；popover 要结构性隐藏整段
// DataScope，native 守卫只可靠支持正向 `{state.x && ...}`。见 memory tsx-jsx-guard-positive-only。
function syncShowFlags(ctx) {
  let show = "both";
  try { show = aglet.settings.get(APP_ID, "show").value || "both"; } catch (_e) {}
  if (ctx && ctx.setStateAt) {
    ctx.setStateAt("/state/show_claude", show !== "codex");
    ctx.setStateAt("/state/show_codex", show !== "claude");
  }
}

// 一拍：读两边凭据 → HTTP 拉用量 → 只写成功的一侧。
async function runRefresh(ctx) {
  syncShowFlags(ctx);

  const claudeCred = await readCred(ctx, "claude");
  const codexCred = await readCred(ctx, "codex");

  const claude = fetchClaude(claudeCred);
  const codex = fetchCodex(codexCred);

  // 两边都没凭据 = 未登录 → 通知宿主(登录门/横幅)。
  if (ctx && ctx.setStateAt) {
    ctx.setStateAt("/state/needs_auth", !!(claude.needs_auth && codex.needs_auth));
  }

  const sample = { ts: ctx.now ? ctx.now() : Date.now() };
  if (claude.ok) sample.claude = claude;
  if (codex.ok) sample.codex = codex;

  if (sample.claude || sample.codex) {
    await processSample(sample, ctx);
  }
  // 无成功一侧：保留 current 上次真值，什么都不写(避免抹成 "…")。
}

export default {
  // 定时 job(manifest jobs[].run = "refresh"，every 5min) + 开窗即刷。
  async refresh(_payload, ctx) {
    await runRefresh(ctx);
  },
  // 右键菜单 "Refresh now"(<TrayMenuItem onSelect="refreshNow">)→ bg handler(无 webview)。
  async refreshNow(_payload, ctx) {
    await runRefresh(ctx);
  },
};
