<Page>
  <Tabs id="main" defaultValue="active" position="bottom">
    <Tab value="active" label={t.tabActive} icon="list-checks">
      <Card>
        <DataForm collection="items">
          <Input name="title" label={t.labelTitle} placeholder={t.titlePlaceholder}/>
          <Textarea name="notes" label={t.labelNotes} placeholder={t.notesPlaceholder} rows={2}/>
          <Input name="due_at" label={t.labelDue} placeholder={t.duePlaceholder}/>
          <HStack justify="end">
            <Button
              label={t.btnAdd}
              color="primary"
              icon="plus"
              disabled={!form.title}
              onClick={() => data.create({
                collection: "items",
                data: {
                  title: form.title,
                  notes: form.notes,
                  due_at: form.due_at,
                  completed: false,
                  created_at: now,
                },
              })}
            />
          </HStack>
        </DataForm>
      </Card>

      <DataList
        collection="items"
        query={{ where: { completed: false }, orderBy: [{ field: "due_at", direction: "asc" }] }}
      >
        <Empty><EmptyState title={t.emptyActive} icon="check-circle"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4} className="flex-1">
                <Heading level={3}>{item.title}</Heading>
                {item.notes && <Text muted className="text-sm">{item.notes}</Text>}
                {item.due_at && (
                  <HStack gap={4} className="items-center">
                    <Badge content={item.due_at | relative} color="warning" icon="clock"/>
                  </HStack>
                )}
              </VStack>
              <Button
                label={t.btnComplete}
                icon="check"
                color="primary"
                onClick={() => data.update({
                  collection: "items", id: item.id, patch: { completed: true, completed_at: now },
                })}
              />
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="done" label={t.tabDone} icon="check">
      <DataList
        collection="items"
        query={{ where: { completed: true }, orderBy: [{ field: "completed_at", direction: "desc" }] }}
      >
        <Empty><EmptyState title={t.emptyDone} icon="trophy"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4} className="flex-1">
                <HStack gap={4} className="items-center">
                  <Badge content={t.tagCompleted} color="success" icon="check"/>
                  <Text muted className="line-through">{item.title}</Text>
                </HStack>
                {item.completed_at && (
                  <Text muted className="text-xs">{item.completed_at | relative}</Text>
                )}
              </VStack>
              <HStack gap={4}>
                <Button
                  label={t.btnUndo}
                  icon="arrow-counter-clockwise"
                  size="sm"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { completed: false, completed_at: "" },
                  })}
                />
                <Button
                  label={t.btnDelete}
                  icon="trash"
                  color="danger"
                  size="sm"
                  onClick={() => data.delete({ collection: "items", id: item.id })}
                />
              </HStack>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>
  </Tabs>
</Page>
