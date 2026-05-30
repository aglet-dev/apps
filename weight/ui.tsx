<Page>
  <Card title={t.cardNew}>
    <DataForm collection="entries">
      <HStack gap={8}>
        <DatePicker name="date" label={t.labelDate}/>
        <NumberField name="weight" label={t.labelWeight} placeholder="72.3" step={0.1}/>
      </HStack>
      <Input name="note" label={t.labelNote} placeholder={t.notePlaceholder}/>
      <HStack justify="end">
        <Button
          label={t.btnAdd}
          color="primary"
          leftIcon="plus"
          disabled={!form.weight}
          onClick={() => data.create({
            collection: "entries",
            data: {
              date: form.date,
              weight: form.weight,
              unit: "kg",
              note: form.note,
              created_at: now,
            },
          })}
        />
      </HStack>
    </DataForm>
  </Card>

  <Card title={t.cardTrend}>
    <Chart
      collection="entries"
      query={{ orderBy: [{ field: "date", direction: "asc" }], limit: 90 }}
      xField="date"
      yField="weight"
      yUnit="kg"
      height={200}
    />
  </Card>

  <Section title={t.sectionHistory}>
    <DataList
      collection="entries"
      query={{ orderBy: [{ field: "date", direction: "desc" }] }}
      paginate={{ pageSize: 20 }}
    >
      <Empty>
        <EmptyState
          title={t.emptyTitle}
          description={t.emptyDesc}
          icon="scales"
        />
      </Empty>
      <Item>
        <Card>
          <HStack justify="between" gap={8}>
            <VStack gap={4}>
              <Heading level={3}>{item.weight} {item.unit}</Heading>
              <Text muted>{item.date}</Text>
              {item.note && <Text muted>{item.note}</Text>}
            </VStack>
            <Button
              label={t.btnDelete}
              color="danger"
              leftIcon="trash"
              size="sm"
              onClick={() => data.delete({ collection: "entries", id: item.id })}
            />
          </HStack>
        </Card>
      </Item>
    </DataList>
  </Section>
</Page>
