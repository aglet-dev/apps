<Page>
  <Tabs id="main" defaultValue="add" position="bottom">
    <Tab value="add" label={t.tabAdd} icon="plus-circle">
      <Card>
        <DataForm collection="entries">
          <Select name="kind" label={t.kindLabel}>
            <Option value="expense" label={t.kindExpense}/>
            <Option value="income" label={t.kindIncome}/>
          </Select>
          <Input name="amount" type="number" label={t.amountLabel} placeholder={t.amountPlaceholder}/>
          <Input name="category" label={t.categoryLabel} placeholder={t.categoryPlaceholder}/>
          <Input name="note" label={t.noteLabel} placeholder={t.notePlaceholder}/>
          <Input name="date" label={t.dateLabel} placeholder={t.datePlaceholder}/>
          <HStack justify="end">
            <Button
              label={t.btnRecord}
              color="primary"
              icon="check"
              disabled={!form.amount}
              onClick={() => data.create({
                collection: "entries",
                data: {
                  kind: form.kind,
                  amount: form.amount,
                  category: form.category,
                  note: form.note,
                  date: form.date,
                },
              })}
            />
          </HStack>
        </DataForm>
      </Card>
    </Tab>

    <Tab value="list" label={t.tabList} icon="list">
      <DataList
        collection="entries"
        query={{ orderBy: [{ field: "date", direction: "desc" }], limit: 100 }}
      >
        <Empty><EmptyState title={t.emptyEntries} icon="wallet"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <HStack gap={6} className="items-center">
                  <Badge content={item.kind} color={item.kind == "income" ? "success" : "danger"}
                    icon={item.kind == "income" ? "arrow-up-right" : "arrow-down-right"}/>
                  {item.category && <Text muted className="text-xs">#{item.category}</Text>}
                </HStack>
                <Heading level={2} className="tabular-nums">{item.amount}</Heading>
                {item.note && <Text muted className="text-xs">{item.note}</Text>}
                {item.date && <Text muted className="text-xs">{item.date}</Text>}
              </VStack>
              <Button
                label={t.btnDelete}
                icon="trash"
                color="danger"
                onClick={() => data.delete({ collection: "entries", id: item.id })}
              />
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="summary" label={t.tabSummary} icon="chart-pie">
      <HStack justify="end">
        <Button label={t.btnRefresh} color="primary" icon="arrow-clockwise" size="sm"
          onClick={() => scripts.refresh()}/>
      </HStack>
      <HStack gap={6} className="mt-4">
        <Card className="flex-1">
          <VStack gap={2}>
            <Text muted className="text-xs uppercase">{t.summaryIncome}</Text>
            <Heading level={1} className="tabular-nums text-emerald-600 dark:text-emerald-400">{state.month_income}</Heading>
          </VStack>
        </Card>
        <Card className="flex-1">
          <VStack gap={2}>
            <Text muted className="text-xs uppercase">{t.summaryExpense}</Text>
            <Heading level={1} className="tabular-nums text-rose-600 dark:text-rose-400">{state.month_expense}</Heading>
          </VStack>
        </Card>
      </HStack>
      <Card className="mt-4">
        <VStack gap={2}>
          <Text muted className="text-xs uppercase">{t.summaryNet}</Text>
          <Heading level={1} className="tabular-nums">{state.month_income - state.month_expense}</Heading>
        </VStack>
      </Card>

      <Section title={t.summaryByCategory}>
        <Card>
          <Text className="font-mono text-xs whitespace-pre-wrap">{state.by_category || t.summaryEmpty}</Text>
        </Card>
      </Section>
    </Tab>
  </Tabs>
</Page>
