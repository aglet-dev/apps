<Page>
  <Tabs id="main" defaultValue="inbox" position="bottom">
    <Tab value="inbox" label={t.tabInbox} icon="tray">
      <Card title={t.cardNew}>
        <DataForm collection="notes">
          <Input name="title" label={t.labelTitle} placeholder={t.titlePlaceholder}/>
          <Combobox name="tag" label={t.labelTag} placeholder={t.tagPlaceholder}>
            <Option value="idea" label={t.tagIdea}/>
            <Option value="todo" label={t.tagTodo}/>
            <Option value="link" label={t.tagLink}/>
          </Combobox>
          <HStack justify="end">
            <Button
              label={t.btnAdd}
              color="primary"
              leftIcon="plus"
              disabled={!form.title}
              onClick={() => data.create({
                collection: "notes",
                data: {
                  title: form.title,
                  tag: form.tag,
                  archived: false,
                  created_at: now,
                },
              })}
            />
          </HStack>
        </DataForm>
      </Card>

      <Section title={t.sectionUnarchived}>
        <DataList
          collection="notes"
          query={{
            where: { archived: false },
            orderBy: [{ field: "created_at", direction: "desc" }],
          }}
        >
          <Empty><EmptyState title={t.emptyInbox} icon="check-circle"/></Empty>
          <Item>
            <Card>
              <HStack justify="between" gap={8}>
                <VStack gap={4}>
                  <Heading level={3}>{item.title}</Heading>
                  {item.tag && <Tag label={item.tag} color="primary"/>}
                </VStack>
                <Button
                  label={t.btnArchive}
                  leftIcon="archive"
                  onClick={() => data.update({
                    collection: "notes",
                    id: item.id,
                    patch: { archived: true },
                  })}
                />
              </HStack>
            </Card>
          </Item>
        </DataList>
      </Section>
    </Tab>

    <Tab value="archive" label={t.tabArchive} icon="archive">
      <Section title={t.sectionArchived}>
        <DataList
          collection="notes"
          query={{ where: { archived: true }, orderBy: [{ field: "created_at", direction: "desc" }] }}
        >
          <Empty><EmptyState title={t.emptyArchive}/></Empty>
          <Item>
            <Card>
              <HStack justify="between" gap={8}>
                <VStack gap={4}>
                  <Text muted className="line-through">{item.title}</Text>
                  {item.tag && <Tag label={item.tag} color="default"/>}
                </VStack>
                <HStack gap={4}>
                  <Button
                    label={t.btnRestore}
                    color="primary"
                    leftIcon="arrow-counter-clockwise"
                    size="sm"
                    onClick={() => data.update({
                      collection: "notes",
                      id: item.id,
                      patch: { archived: false },
                    })}
                  />
                  <Button
                    label={t.btnDelete}
                    color="danger"
                    leftIcon="trash"
                    size="sm"
                    onClick={() => app.confirm({
                      title: t.confirmDeleteTitle,
                      description: t.confirmDeleteDesc,
                      color: "danger",
                      onConfirm: () => data.delete({ collection: "notes", id: item.id }),
                    })}
                  />
                </HStack>
              </HStack>
            </Card>
          </Item>
        </DataList>
      </Section>
    </Tab>
  </Tabs>
</Page>
