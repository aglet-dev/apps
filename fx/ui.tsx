<Page className="p-4">
  <VStack gap={8}>
    <Card>
      <HStack justify="between">
        <VStack gap={2}>
          <Heading level={3}>{t.sectionRates}</Heading>
          {state.rates_at && <Text muted className="text-xs">{state.rates_at}</Text>}
          {!state.rates_at && <Text muted className="text-xs">{t.rateNotFetched}</Text>}
        </VStack>
        <Button label={t.btnRefresh} icon="arrow-clockwise" color="primary"
          onClick={() => scripts.fetchRates()}/>
      </HStack>
    </Card>

    <DataForm collection="scratch">
      <Card>
        <Heading level={3}>{t.sectionCalc}</Heading>
        <HStack gap={6}>
          <Input name="cost" type="number" label={t.labelCost} placeholder={t.costPlaceholder}/>
          <Select name="cost_ccy" label={t.labelCcy} placeholder={t.ccyPlaceholder}>
            <Option value="USD" label="USD"/>
            <Option value="CNY" label="CNY"/>
            <Option value="JPY" label="JPY"/>
            <Option value="EUR" label="EUR"/>
            <Option value="HKD" label="HKD"/>
            <Option value="KRW" label="KRW"/>
          </Select>
        </HStack>
        <HStack gap={6}>
          <Input name="price" type="number" label={t.labelPrice} placeholder={t.pricePlaceholder}/>
          <Select name="price_ccy" label={t.labelCcy} placeholder={t.ccyPlaceholder}>
            <Option value="USD" label="USD"/>
            <Option value="CNY" label="CNY"/>
            <Option value="JPY" label="JPY"/>
            <Option value="EUR" label="EUR"/>
            <Option value="HKD" label="HKD"/>
            <Option value="KRW" label="KRW"/>
          </Select>
        </HStack>
        <Input name="fees_pct" type="number" label={t.labelFees} placeholder={t.feesPlaceholder}/>
        <HStack justify="end" gap={6}>
          <Button label={t.btnClear} icon="x" size="sm"
            onClick={() => scripts.clear()}/>
          <Button label={t.btnCalc} color="primary" icon="calculator"
            disabled={!form.cost}
            onClick={() => scripts.calc({
              cost: form.cost, price: form.price, fees_pct: form.fees_pct,
              cost_ccy: form.cost_ccy, price_ccy: form.price_ccy,
            })}/>
        </HStack>
      </Card>
    </DataForm>

    {state.loading && <Text muted className="text-xs">{t.loading}</Text>}

    {state.error && (
      <Alert title={t.errorTitle} description={state.error} color="danger" icon="warning"/>
    )}

    {state.result && (
      <Card>
        <Text className="font-mono text-xs whitespace-pre-wrap">{state.result}</Text>
      </Card>
    )}
  </VStack>
</Page>
