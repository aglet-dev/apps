<script>
// tip / split 全在 /state/* 里；spec 不允许 NumberField/Slider 脱离 DataForm
// 又没 /form/* bootstrap，简化用 Buttons 调 scripts.adjust(...)。
// 派生显示（tip / total / per-person）走 tsx math 指令，不进 scripts。
export default {
  adjust({ key, delta }, ctx) {
    const cur = Number(ctx.scope.state[key]) || 0;
    let next = cur + delta;
    // 各 key 上下限
    if (key === "bill") next = Math.max(0, next);
    if (key === "tipPct") next = Math.max(0, Math.min(50, next));
    if (key === "splitN") next = Math.max(1, Math.min(20, next));
    ctx.setState({ [key]: next });
  },
};
</script>

<Page className="p-6">
  <VStack gap={8}>
    <Heading level={1}>{t.title}</Heading>

    {/* Bill */}
    <VStack gap={2}>
      <HStack justify="between">
        <Text muted>{t.bill}</Text>
        <Heading level={2} className="tabular-nums">{state.bill}</Heading>
      </HStack>
      <HStack gap={2}>
        <Button label="−10" onClick={() => scripts.adjust({key:"bill", delta:-10})}/>
        <Button label="−1" onClick={() => scripts.adjust({key:"bill", delta:-1})}/>
        <Button label="+1" color="primary" onClick={() => scripts.adjust({key:"bill", delta:1})}/>
        <Button label="+10" color="primary" onClick={() => scripts.adjust({key:"bill", delta:10})}/>
      </HStack>
    </VStack>

    {/* Tip % */}
    <VStack gap={2}>
      <HStack justify="between">
        <Text muted>{t.tipPct}</Text>
        <Heading level={3} className="tabular-nums">{state.tipPct}%</Heading>
      </HStack>
      <HStack gap={2}>
        <Button label="−1" onClick={() => scripts.adjust({key:"tipPct", delta:-1})}/>
        <Button label="+1" color="primary" onClick={() => scripts.adjust({key:"tipPct", delta:1})}/>
        <Button label="+5" color="primary" onClick={() => scripts.adjust({key:"tipPct", delta:5})}/>
      </HStack>
    </VStack>

    {/* Split */}
    <VStack gap={2}>
      <HStack justify="between">
        <Text muted>{t.splitN}</Text>
        <Heading level={3} className="tabular-nums">{state.splitN}</Heading>
      </HStack>
      <HStack gap={2}>
        <Button label="−1" onClick={() => scripts.adjust({key:"splitN", delta:-1})}/>
        <Button label="+1" color="primary" onClick={() => scripts.adjust({key:"splitN", delta:1})}/>
      </HStack>
    </VStack>

    {/* 派生：tsx lower `+ * /` → math directive */}
    <Card className="bg-zinc-50 dark:bg-zinc-900">
      <VStack gap={2}>
        <HStack justify="between">
          <Text muted>{t.tip}</Text>
          <Text className="tabular-nums">{state.bill * state.tipPct / 100}</Text>
        </HStack>
        <HStack justify="between">
          <Text muted>{t.total}</Text>
          <Text className="tabular-nums">{state.bill + state.bill * state.tipPct / 100}</Text>
        </HStack>
        <Divider/>
        <HStack justify="between">
          <Heading level={3}>{t.perPerson}</Heading>
          <Heading level={3} className="tabular-nums">
            {(state.bill + state.bill * state.tipPct / 100) / state.splitN}
          </Heading>
        </HStack>
      </VStack>
    </Card>
  </VStack>
</Page>
