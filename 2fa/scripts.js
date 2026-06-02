/// <reference path="../.types/aglet.d.ts" />
// 2fa scripts —— otpauth:// URI parse + TOTP via crypto.totp.
//
// State shape:
//   add_uri:  staging input from UI (the otpauth URI text field)
//   add_err:  last add error message (cleared on success)
//
// TOTP 全交给 crypto.totp（crypto >= 0.1.3）：base32 解码 + 8 字节 counter +
// RFC 4226 动态截断都在 audited 的 wasm 插件里。app 不再手搓 HMAC / 截断 /
// base32，也删掉了原本只为跨 ABI 用的 JS b64 codec —— 兑现旧注释的 dogfood-backlog-totp。

const APP_ID = "2fa";

// ─── otpauth URI parse ──────────────────────────────────────────────────────

function parseOtpauth(uri) {
  // otpauth://totp/Issuer:account?secret=BASE32&issuer=Issuer&algorithm=SHA1&digits=6&period=30
  const m = uri.match(/^otpauth:\/\/totp\/([^?]+)\?(.+)$/i);
  if (!m) throw new Error("not an otpauth://totp URI");
  const label = decodeURIComponent(m[1]);
  const params = {};
  for (const pair of m[2].split("&")) {
    const [k, v] = pair.split("=");
    params[k.toLowerCase()] = decodeURIComponent(v || "");
  }
  if (!params.secret) throw new Error("missing secret");

  // Label may be "Issuer:account" or just "account"
  let issuer = params.issuer || "";
  let account = label;
  const colon = label.indexOf(":");
  if (colon > 0) {
    if (!issuer) issuer = label.slice(0, colon);
    account = label.slice(colon + 1);
  }
  return {
    issuer: issuer.trim(),
    account: account.trim(),
    secret_b32: params.secret.toUpperCase(),
    algo: (params.algorithm || "SHA1").toUpperCase(),
    digits: parseInt(params.digits || "6", 10),
    period: parseInt(params.period || "30", 10),
  };
}

// ─── TOTP via crypto.totp plugin ──────────────────────────────────────────────

async function totpCode(account, nowSec, plugins) {
  const { code } = await plugins.crypto.totp({
    secret_b32: account.secret_b32,
    unix_seconds: nowSec,
    algo: account.algo || "SHA1",
    digits: account.digits || 6,
    period: account.period || 30,
  });
  return code;
}

// ─── handlers ───────────────────────────────────────────────────────────────

export default {
  // Tick @ 1Hz: recompute `current_code` only when it actually changed (period
  // boundary crossed). 倒计时 UI 走 `$countdown(item.period)` reactive directive，
  // 不再 per-second 写 row。
  async tick(_, ctx) {
    const list = aglet.data.list(APP_ID, "accounts", { limit: 200 });
    // ctx.now() 替 Date.now()，让 scenario 可注入固定时间验 RFC 6238 测向量。
    const nowSec = Math.floor(ctx.now() / 1000);
    for (const row of list.items) {
      let nextCode;
      try {
        nextCode = await totpCode(row.data, nowSec, ctx.plugins);
      } catch (_e) {
        nextCode = "------";
      }
      if (row.data.current_code !== nextCode) {
        aglet.data.update(APP_ID, "accounts", row.id, { current_code: nextCode });
      }
    }
  },

  // From UI: parse otpauth URI in state.add_uri, store into accounts collection.
  async addFromUri(_, ctx) {
    const uri = (ctx.state.add_uri || "").trim();
    if (!uri) return ctx.setState({ add_err: "paste an otpauth://totp/... URI first" });
    try {
      const parsed = parseOtpauth(uri);
      // Sanity-check the secret actually computes —— crypto.totp errors on bad base32.
      await ctx.plugins.crypto.totp({
        secret_b32: parsed.secret_b32,
        unix_seconds: 0,
        algo: parsed.algo,
        digits: parsed.digits,
        period: parsed.period,
      });
      await ctx.dispatch("data.create", {
        collection: "accounts",
        data: { ...parsed, created_at: new Date().toISOString() },
      });
      ctx.setState({ add_uri: "", add_err: "" });
    } catch (e) {
      ctx.setState({ add_err: String(e.message || e) });
    }
  },

  // Delete an account by id.
  async remove({ id }, ctx) {
    await ctx.dispatch("data.delete", { collection: "accounts", id });
  },
};
