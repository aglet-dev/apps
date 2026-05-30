<script>
// 25 min work / 5 min break pomodoro。timer.ui.tsx 同款单源 scripts pattern。
// host manifest.timers 每秒调 scripts.tick(null, ctx)；running=true 才发。

const WORK_S = 25 * 60;
const BREAK_S = 5 * 60;

function fmt(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function durFor(phase) {
  return phase === "break" ? BREAK_S : WORK_S;
}

export default {
  toggle(_args, ctx) {
    const s = ctx.scope.state;
    if (s.running) {
      ctx.setState({ running: false });
      return;
    }
    // 已经 0 → 切下一相位
    const remaining = (Number(s.remaining) || 0) > 0
      ? Number(s.remaining)
      : durFor(s.phase);
    ctx.setState({
      remaining,
      display: fmt(remaining),
      running: true,
    });
  },

  reset(_args, ctx) {
    const dur = durFor(ctx.scope.state.phase);
    ctx.setState({
      remaining: dur,
      display: fmt(dur),
      running: false,
    });
  },

  // 切下一相位（不自动开始）—— work ↔ break 来回切。
  skip(_args, ctx) {
    const cur = ctx.scope.state.phase;
    const next = cur === "work" ? "break" : "work";
    const dur = durFor(next);
    const cyclesInc = cur === "work" ? 1 : 0;
    ctx.setState({
      phase: next,
      remaining: dur,
      display: fmt(dur),
      running: false,
      cycles: (Number(ctx.scope.state.cycles) || 0) + cyclesInc,
    });
  },

  // 每秒 tick：递减；到 0 自动切相位（但不自动开始）。
  tick(_args, ctx) {
    const remaining = Number(ctx.scope.state.remaining) || 0;
    const next = remaining - 1;
    if (next <= 0) {
      // 当前相位结束：work 完算一轮，自动切 break；break 完切 work。
      const cur = ctx.scope.state.phase;
      const nextPhase = cur === "work" ? "break" : "work";
      const dur = durFor(nextPhase);
      const cyclesInc = cur === "work" ? 1 : 0;
      ctx.setState({
        phase: nextPhase,
        remaining: dur,
        display: fmt(dur),
        running: false,  // 用户手动 start 下一段
        cycles: (Number(ctx.scope.state.cycles) || 0) + cyclesInc,
      });
      return;
    }
    ctx.setState({ remaining: next, display: fmt(next) });
  },
};
</script>

<Page className="min-h-screen p-6 flex flex-col items-center justify-center select-none bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
  <VStack gap={2} className="items-center mb-8">
    <Badge
      content={state.phase == "break" ? t.phaseBreak : t.phaseWork}
      color={state.phase == "break" ? "success" : "primary"}
      icon={state.phase == "break" ? "coffee" : "brain"}/>
    <Heading
      level={1}
      content={state.display}
      className="text-8xl font-light tabular-nums tracking-tight text-zinc-900 dark:text-white mt-2"/>
    <Text muted className="text-xs uppercase tracking-wider">
      {t.cyclesDone}: {state.cycles}
    </Text>
  </VStack>

  <HStack gap={4}>
    {state.running ?
      <Button label={t.btnPause}
        icon="pause"
        className="h-14 w-28 rounded-full bg-orange-500 text-white text-lg font-medium hover:brightness-110 shadow-lg shadow-orange-500/30 transition"
        onClick={() => scripts.toggle()}/>
      :
      <Button label={t.btnStart}
        icon="play"
        className="h-14 w-28 rounded-full bg-orange-500 text-white text-lg font-medium hover:brightness-110 shadow-lg shadow-orange-500/30 transition"
        onClick={() => scripts.toggle()}/>
    }
    <Button label={t.btnReset}
      icon="arrow-counter-clockwise"
      className="h-14 w-28 rounded-full bg-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100 text-lg font-medium hover:brightness-110 transition"
      onClick={() => scripts.reset()}/>
  </HStack>

  <Button label={t.btnSkip}
    icon="skip-forward"
    className="mt-6 text-zinc-500 dark:text-zinc-400 text-sm hover:text-zinc-700 dark:hover:text-zinc-200 transition"
    onClick={() => scripts.skip()}/>
</Page>
