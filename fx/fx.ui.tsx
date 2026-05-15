<Page className="p-4">
  <VStack gap={8}>
    <Card>
      <HStack justify="between">
        <VStack gap={2}>
          <Heading level={3}>汇率</Heading>
          {state.rates_at && <Text muted className="text-xs">{state.rates_at}</Text>}
          {!state.rates_at && <Text muted className="text-xs">未拉取，先点 ↻</Text>}
        </VStack>
        <Button label="刷新汇率" icon="arrow-clockwise" color="primary"
          onClick={() => scripts.fetchRates()}/>
      </HStack>
    </Card>

    <DataForm collection="scratch">
      <Card>
        <Heading level={3}>计算</Heading>
        <HStack gap={6}>
          <Input name="cost" type="number" label="" placeholder="成本"/>
          <Select name="cost_ccy" placeholder="币种">
            <Option value="USD" label="USD"/>
            <Option value="CNY" label="CNY"/>
            <Option value="JPY" label="JPY"/>
            <Option value="EUR" label="EUR"/>
            <Option value="HKD" label="HKD"/>
            <Option value="KRW" label="KRW"/>
          </Select>
        </HStack>
        <HStack gap={6}>
          <Input name="price" type="number" label="" placeholder="售价"/>
          <Select name="price_ccy" placeholder="币种">
            <Option value="USD" label="USD"/>
            <Option value="CNY" label="CNY"/>
            <Option value="JPY" label="JPY"/>
            <Option value="EUR" label="EUR"/>
            <Option value="HKD" label="HKD"/>
            <Option value="KRW" label="KRW"/>
          </Select>
        </HStack>
        <Input name="fees_pct" type="number" label="" placeholder="平台手续费 %（可选）"/>
        <HStack justify="end" gap={6}>
          <Button label="清空" icon="x"
            onClick={() => scripts.clear()}/>
          <Button label="计算" color="primary" icon="calculator"
            disabled={!form.cost}
            onClick={() => scripts.calc({
              cost: form.cost, price: form.price, fees_pct: form.fees_pct,
              cost_ccy: form.cost_ccy, price_ccy: form.price_ccy,
            })}/>
        </HStack>
      </Card>
    </DataForm>

    {state.loading && <Text muted className="text-xs">拉取中…</Text>}

    {state.error && (
      <Card className="border border-red-500/40 bg-red-500/5">
        <Text className="text-red-500 text-sm font-mono">{state.error}</Text>
      </Card>
    )}

    {state.result && (
      <Card>
        <Text className="font-mono text-xs whitespace-pre-wrap">{state.result}</Text>
      </Card>
    )}
  </VStack>
</Page>
