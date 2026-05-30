<style>
html, body { overscroll-behavior: none; }
</style>

<script>
// 倒计时：host 端 manifest.timers 每秒调 scripts.tick(null, ctx)；scripts 只读
// state.remaining 算下一帧。web (setInterval) / apple (DispatchSourceTimer) 同语义。
// running=true 启动；done=true 停（host 自动 cancel timer）。

function fmt(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default {
  preset({ s, label }, ctx) {
    ctx.setState({
      seconds: s,
      remaining: s,
      display: fmt(s),
      preset: label,
      running: false,
      done: false,
    });
  },

  toggle(_args, ctx) {
    const s = ctx.scope.state;
    if (s.running) {
      ctx.setState({ running: false });
      return;
    }
    const remaining = (Number(s.remaining) || 0) > 0
      ? Number(s.remaining)
      : Number(s.seconds) || 60;
    ctx.setState({
      remaining: remaining,
      display: fmt(remaining),
      running: true,
      done: false,
    });
  },

  reset(_args, ctx) {
    const preset = Number(ctx.scope.state.seconds) || 60;
    ctx.setState({
      remaining: preset,
      display: fmt(preset),
      running: false,
      done: false,
    });
  },

  // host timer 每秒一发：递减 remaining，到 0 设 done=true (host 自动停)。
  tick(_args, ctx) {
    const remaining = Number(ctx.scope.state.remaining) || 0;
    const next = remaining - 1;
    if (next <= 0) {
      ctx.setState({ remaining: 0, display: fmt(0), running: false, done: true });
      return;
    }
    ctx.setState({ remaining: next, display: fmt(next) });
  },
};
</script>

<Page className="min-h-screen p-6 flex flex-col items-center justify-center select-none bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
<VStack gap={2} className="items-center mb-10">
    <Heading
      level={1}
      content={state.display}
      className="text-8xl font-light tabular-nums tracking-tight text-zinc-900 dark:text-white"/>
    <HStack gap={3} className="items-center mt-2">
      <Badge
        content={state.done ? t.stateDone : (state.running ? t.stateRunning : t.statePaused)}
        color={state.done ? "warning" : (state.running ? "success" : undefined)}
        icon={state.done ? "check-circle" : (state.running ? "play-circle" : "pause-circle")}/>
      <Text muted className="text-xs uppercase tracking-wider">{state.preset}</Text>
    </HStack>
  </VStack>

<HStack gap={3} className="mb-10">
    <Button label="30s"
      className="h-10 w-14 rounded-full bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 text-sm font-medium hover:brightness-110 transition"
      pressed={state.preset == "30s"}
      onClick={() => scripts.preset({s: 30, label: "30s"})}/>
    <Button label="1m"
      className="h-10 w-14 rounded-full bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 text-sm font-medium hover:brightness-110 transition"
      pressed={state.preset == "1m"}
      onClick={() => scripts.preset({s: 60, label: "1m"})}/>
    <Button label="5m"
      className="h-10 w-14 rounded-full bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 text-sm font-medium hover:brightness-110 transition"
      pressed={state.preset == "5m"}
      onClick={() => scripts.preset({s: 300, label: "5m"})}/>
    <Button label="10m"
      className="h-10 w-14 rounded-full bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 text-sm font-medium hover:brightness-110 transition"
      pressed={state.preset == "10m"}
      onClick={() => scripts.preset({s: 600, label: "10m"})}/>
  </HStack>

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
</Page>
