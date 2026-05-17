<Page>
  <Section>
    <Heading level={2}>{t.title}</Heading>
    <Text muted>{t.subtitle}</Text>
  </Section>
  <DataList
    collection="schedules"
    query={{ orderBy: [{ field: "app_id", direction: "asc" }] }}
  >
    <Empty>
      <EmptyState
        title={t.emptyTitle}
        description={t.emptyDesc}
        icon="clock"
      />
    </Empty>
    <Item>
      <Card>
        <VStack gap={6}>
          <HStack justify="between" gap={6}>
            <Heading level={3}>{item.app_id}</Heading>
            {item.enabled
              ? <Badge content={t.tagEnabled} color="success" icon="check"/>
              : <Badge content={t.tagDisabled} color="default" icon="pause"/>}
          </HStack>
          <Text muted>
            {t.metaEvery} {item.interval_seconds}{t.metaSeconds} · {t.metaNext} {item.next_run_at | relative} · {t.metaLast} {item.last_run_at | relative} · {item.last_status}
          </Text>
          <HStack justify="end" gap={8}>
            <Button
              label={t.btnEnable}
              icon="toggle-right"
              pressed={item.enabled}
              onClick={() => data.update({
                collection: "schedules",
                id: item.id,
                patch: { enabled: !item.enabled },
              })}
            />
            <Button
              label={t.btnRunNow}
              icon="play"
              onClick={() => data.update({
                collection: "schedules",
                id: item.id,
                patch: { next_run_at: "1970-01-01T00:00:00Z" },
              })}
            />
          </HStack>
        </VStack>
      </Card>
    </Item>
  </DataList>
</Page>
