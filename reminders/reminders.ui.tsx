<Page>
  <Tabs defaultValue="active" position="bottom">
    <Tab value="active" label="待办" icon="list-checks">
      <Card>
        <DataForm collection="items">
          <Input name="title" label="" placeholder="加一条提醒…"/>
          <Textarea name="notes" label="" placeholder="备注（可选）" rows={2}/>
          <Input name="due_at" label="" placeholder="截止时间（可选）：YYYY-MM-DD HH:MM"/>
          <HStack justify="end">
            <Button
              label="添加"
              color="primary"
              icon="plus"
              onClick={() => data.create({
                collection: "items",
                data: { title: form.title, notes: form.notes, due_at: form.due_at, completed: false, created_at: now },
              })}
            />
          </HStack>
        </DataForm>
      </Card>

      <DataList
        collection="items"
        query={{ where: { completed: false }, orderBy: [{ field: "due_at", direction: "asc" }] }}
      >
        <Empty><EmptyState title="清单空空如也" icon="check-circle"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Heading level={3}>{item.title}</Heading>
                {item.notes && <Text muted>{item.notes}</Text>}
                {item.due_at && <Text muted>截止 {item.due_at | relative}</Text>}
              </VStack>
              <Button
                label="完成"
                icon="check"
                onClick={() => data.update({
                  collection: "items", id: item.id, patch: { completed: true, completed_at: now },
                })}
              />
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="done" label="完成" icon="check">
      <DataList
        collection="items"
        query={{ where: { completed: true }, orderBy: [{ field: "completed_at", direction: "desc" }] }}
      >
        <Empty><EmptyState title="还没有完成的提醒" icon="trophy"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>✓ {item.title}</Text>
                {item.completed_at && <Text muted>{item.completed_at | relative}完成</Text>}
              </VStack>
              <Button
                label="撤销"
                icon="arrow-counter-clockwise"
                onClick={() => data.update({
                  collection: "items", id: item.id, patch: { completed: false, completed_at: "" },
                })}
              />
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>
  </Tabs>
</Page>
