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

// 提醒触发时刻 epoch ms：下次发生日（循环→今年的月日，过了取明年）提前 remindDays 天、
// 当地 09:00。配 notifications.schedule({repeat:"yearly"}) → 每年同月日 9 点响。
function reminderAtMs(dateStr, remindDays, nowMs) {
  const ev = parseYMD(dateStr);
  if (!ev) return null;
  const today = new Date(nowMs);
  const todayNum = dayNum(today.getFullYear(), today.getMonth() + 1, today.getDate());
  let ny = today.getFullYear();
  if (dayNum(ny, ev.mo, ev.d) < todayNum) ny += 1; // 今年的已过 → 明年
  const occ = new Date(ny, ev.mo - 1, ev.d, 9, 0, 0, 0);
  occ.setDate(occ.getDate() - remindDays); // 提前 N 天（可跨月/年，Date 自处理）
  return occ.getTime();
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
  const nextYears = nxt.y - ev.y; // 下次发生时要满的岁数 / 第几周年

  // 下次发生是星期几（周日=0 .. 周六=6）→ 拼到 next_at 后。
  const wd = new Date(Date.UTC(nxt.y, nxt.mo - 1, nxt.d)).getUTCDay();
  const next_at = t("nextAt", { mo: nxt.mo, d: nxt.d }) + " " + t("wd" + wd);

  let milestone = "";
  if (e.kind === "birthday") milestone = nextYears > 0 ? t("msBirthday", { n: nextYears }) : t("msBorn");
  else if (e.kind === "anniversary") milestone = nextYears > 0 ? t("msAnniversary", { n: nextYears }) : "";
  else if (e.kind === "custom" && recurring) milestone = nextYears > 0 ? t("msCustom", { n: nextYears }) : "";

  // 已历时长。日历月差 + 余天（非 /30.44 估算）。生日(循环)=当前实龄；纪念日/自定义
  // (循环)=已过多久；一次性已过事件=精确「X 年 X 个月 X 天前」（比裸 days 更有体感）。
  let age_label = "";
  const elapsedDays = todayNum - dayNum(ev.y, ev.mo, ev.d);
  if (elapsedDays >= 0) {
    let months = (today.getFullYear() - ev.y) * 12 + (today.getMonth() + 1 - ev.mo);
    let days = today.getDate() - ev.d;
    if (days < 0) {
      months -= 1;
      // 借上个月的天数（today.getMonth() 是 0-indexed 当前月 → day 0 = 上月最后一天）
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    const ay = Math.floor(months / 12);
    const am = months % 12;
    if (recurring && e.kind === "birthday") {
      age_label = months < 1 ? t("ageDays", { n: elapsedDays })
        : ay < 1 ? t("ageMonthsDays", { m: am, d: days })
        : t("ageYearsMonths", { y: ay, m: am });
    } else if (recurring) {
      // anniversary / custom（循环）= 已 X 年 X 个月
      age_label = ay >= 1 ? t("elapsedYearsMonths", { y: ay, m: am })
        : months >= 1 ? t("elapsedMonthsDays", { m: am, d: days })
        : t("elapsedDays", { n: elapsedDays });
    } else {
      // 一次性已过事件（elapsedDays>=0 即已过）= X 年 X 个月 X 天前。
      // <1 月时裸 days_big("X 天前") 已够，不再叠 badge。
      age_label = ay >= 1 ? t("agoYearsMD", { y: ay, m: am, d: days })
        : months >= 1 ? t("agoMonthsD", { m: am, d: days })
        : "";
    }
  }

  // 展示用：一次性已过事件 days_until 为负，卡片大数字要显示「X 天前」而非负数。
  //   未来 → 正数 + "天后"；今天 → "今天"（无副标题）；已过 → 绝对值 + "天前"。
  const past = days_until < 0;
  const days_big = days_until === 0 ? t("today") : String(Math.abs(days_until));
  const days_word = days_until === 0 ? "" : t(past ? "daysAgo" : "daysLeft");
  // 排序键：未来按天数升序在前；一次性已过沉到最后（按最近在前），避免过去事件占「下一个」。
  const sort_key = days_until >= 0 ? days_until : 1000000 + Math.abs(days_until);

  // 声明式提醒（P2b-A）：把「下次发生提前 N 天、当地 9 点」算进字段，host 按
  // manifest.reminders 绑定自动 schedule（repeat:yearly）/cancel。remind_days<0
  // → remind_at_ms=0 → host 取消。app 不再写 notifications.schedule/cancel。
  const remind_at_ms = (e.remind_days != null && e.remind_days >= 0)
    ? (reminderAtMs(e.date, e.remind_days, nowMs) || 0)
    : 0;
  const remind_title = "🎉 " + (e.title || "");
  const remind_body = t("remindBody", {});

  return {
    days_until, sort_key, days_big, days_word, next_at, milestone, age_label,
    remind_at_ms, remind_title, remind_body,
  };
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
  const rd = parseInt(f.remind_days != null ? f.remind_days : "-1", 10);
  // 提醒不在这里排：建记录后 refresh() 会 derive 出 remind_at_ms，host 按
  // manifest.reminders 绑定自动 schedule（声明式，P2b-A）。
  await ctx.dispatch("data.create", {
    collection: "events",
    data: {
      title: title,
      date: f.date,
      kind: f.kind || "birthday",
      recurring: f.recurring !== false,
      remind_days: rd,
      created_at: new Date(ctx.now()).toISOString(),
    },
  });
  ctx.setStateAt("/form/title", "");
  ctx.setStateAt("/form/date", "");
  // 关闭底部录入 drawer（state-bound：/state/_ui/drawers/<id>）。
  ctx.setStateAt("/state/_ui/drawers/add", false);
  await refresh(_args, ctx);
  return { ok: true };
}

// 删事件：data.delete 后 host 按 manifest.reminders 绑定自动 cancel 该 row 的
// 年度提醒（声明式，P2b-A），无需 app 手 cancel。
async function removeEvent(args, ctx) {
  await ctx.dispatch("data.delete", { collection: "events", id: args.id });
  return { ok: true };
}

export default { refresh, addEvent, removeEvent };
