<Page>
  <Card title={t.cardNew}>
    <DataForm collection="queue">
      <Input
        name="url"
        label={t.labelUrl}
        placeholder={t.urlPlaceholder}
      />
      <HStack justify="end" gap={6}>
        <Text muted>{t.hintReload}</Text>
        <Button
          label={t.btnFetch}
          color="primary"
          leftIcon="download-simple"
          disabled={!form.url}
          onClick={() => data.create({
            collection: "queue",
            data: { url: form.url, created_at: now },
          })}
        />
      </HStack>
    </DataForm>
  </Card>

  <Section title={t.sectionHistory}>
    <DataList
      collection="articles"
      query={{ orderBy: [{ field: "fetched_at", direction: "desc" }], limit: 100 }}
      paginate={{ pageSize: 10 }}
    >
      <Empty>
        <EmptyState
          title={t.emptyTitle}
          description={t.emptyDesc}
          icon="book-open"
        />
      </Empty>
      <Item>
        <Card>
          <VStack gap={6}>
            <Heading level={3}>{item.title}</Heading>
            <HStack gap="sm">
              <Tag label={item.domain} color="primary"/>
              <Text muted className="truncate">{item.url}</Text>
            </HStack>
            <Text>{item.summary}</Text>
            <Divider/>
            <Markdown source={item.content}/>
            <HStack justify="end" gap={6}>
              <Link label={t.btnSource} icon="link" href={item.url}/>
              <Button
                label={t.btnDelete}
                color="danger"
                leftIcon="trash"
                size="sm"
                onClick={() => app.confirm({
                  title: t.confirmDeleteTitle,
                  description: t.confirmDeleteDesc,
                  color: "danger",
                  onConfirm: () => data.delete({ collection: "articles", id: item.id }),
                })}
              />
            </HStack>
          </VStack>
        </Card>
      </Item>
    </DataList>
  </Section>
</Page>
