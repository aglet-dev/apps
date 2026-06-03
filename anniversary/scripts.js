// 纪念日计算 —— 纯日期算术（ctx.now() + Date），refresh 把派生字段写回记录。
// scripts 在 web(webview) 和 host(QuickJS automation) 两处都跑：统一用 ctx.now()
// + await ctx.dispatch(...)（host 同步值 await 也 OK），两端一致。

function parseYMD(s) {
  if (typeof s !== "string") return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return { y: +m[1], mo: +m[2], d: +m[3] };
}

// 按日历日(忽略时区)算天数序号 —— 两边都走 Date.UTC，diff 即整日数。
function dayNum(y, mo, d) {
  return Math.floor(Date.UTC(y, mo - 1, d) / 86400000);
}

// 给定一条 event 的字段 + 当前 epoch ms + i18n 函数 t → 派生
// {days_until, next_at, milestone, age_label}。t = ctx.t（'key',{params} 查表+插值）。
function derive(e, nowMs, t) {
  const ev = parseYMD(e.date);
  if (!ev) return { days_until: 99999, next_at: "", milestone: "", age_label: "" };

  const today = new Date(nowMs);
  const todayNum = dayNum(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const recurring = e.recurring !== false;

  // 下一次发生日：循环 → 今年的月日，过了就明年；一次性 → 原日期。
  let nxt;
  if (recurring) {
    nxt = { y: today.getFullYear(), mo: ev.mo, d: ev.d };
    if (dayNum(nxt.y, nxt.mo, nxt.d) < todayNum) nxt.y += 1;
  } else {
    nxt = { y: ev.y, mo: ev.mo, d: ev.d };
  }

  const days_until = dayNum(nxt.y, nxt.mo, nxt.d) - todayNum;
  const years = nxt.y - ev.y; // 下次发生时要满的岁数 / 第几周年

  let milestone = "";
  if (e.kind === "birthday") milestone = years > 0 ? t("msBirthday", { n: years }) : t("msBorn");
  else if (e.kind === "anniversary") milestone = years > 0 ? t("msAnniversary", { n: years }) : "";

  // 不满一岁（生日、循环）：额外显示当前实龄。
  let age_label = "";
  if (e.kind === "birthday" && recurring) {
    const ageDays = todayNum - dayNum(ev.y, ev.mo, ev.d);
    if (ageDays >= 0 && ageDays < 365) {
      age_label = ageDays < 100
        ? t("ageDays", { n: ageDays })
        : t("ageMonths", { n: Math.floor(ageDays / 30.44) });
    }
  }

  return { days_until, next_at: t("nextAt", { mo: nxt.mo, d: nxt.d }), milestone, age_label };
}

// 重算所有 events 的派生字段。app 打开(onEnter) + 添加后触发。
async function refresh(_args, ctx) {
  const nowMs = ctx.now();
  const resp = await ctx.dispatch("data.list", { collection: "events" });
  const items = (resp && resp.items) || [];
  for (const rec of items) {
    const patch = derive(rec.data || rec, nowMs, ctx.t);
    await ctx.dispatch("data.update", { collection: "events", id: rec.id, patch });
  }
  return { count: items.length };
}

// 从表单加一条，然后重算 + 清表单。
async function addEvent(_args, ctx) {
  const f = ctx.form || {};
  const title = ((f.title || "") + "").trim();
  if (!title || !f.date) return { ok: false, reason: "need title + date" };
  await ctx.dispatch("data.create", {
    collection: "events",
    data: {
      title: title,
      date: f.date,
      kind: f.kind || "birthday",
      recurring: f.recurring !== false,
      created_at: new Date(ctx.now()).toISOString(),
    },
  });
  ctx.setStateAt("/form/title", "");
  ctx.setStateAt("/form/date", "");
  await refresh(_args, ctx);
  return { ok: true };
}

export default { refresh, addEvent };
