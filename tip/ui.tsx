<Page className="p-6">
  <VStack gap={8}>
    <Heading level={1}>{t.title}</Heading>

    {/* NumberField + Slider 用 bind="/state/<x>" 直绑 state，无需 DataForm。
        manifest.state 提供初值。 */}
    <NumberField name="bill" bind="/state/bill" label={t.bill} min={0} step={1}/>

    <VStack gap={2}>
      <HStack justify="between">
        <Text>{t.tipPct}</Text>
        <Text className="tabular-nums">{state.tipPct}%</Text>
      </HStack>
      <Slider name="tipPct" bind="/state/tipPct" min={0} max={50} step={1}/>
    </VStack>

    <VStack gap={2}>
      <HStack justify="between">
        <Text>{t.splitN}</Text>
        <Text className="tabular-nums">{state.splitN}</Text>
      </HStack>
      <Slider name="splitN" bind="/state/splitN" min={1} max={10} step={1}/>
    </VStack>

    {/* 派生：tsx lower `* + /` → math directive */}
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
