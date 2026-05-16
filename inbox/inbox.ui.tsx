<Page>
  <Tabs defaultValue="inbox" position="bottom">
    <Tab value="inbox" label="收件箱" icon="tray">
      <Card title="新建">
        <DataForm collection="notes">
          <Input name="title" label="" placeholder="想到什么就记下来…"/>
          <Select name="tag" label="" placeholder="标签">
            <Option value="idea" label="💡 灵感"/>
            <Option value="todo" label="✅ 待办"/>
            <Option value="link" label="🔗 链接"/>
          </Select>
          <HStack justify="end">
            <Button
              label="添加"
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

      <Section title="未归档">
        <DataList
          collection="notes"
          query={{
            where: { archived: false },
            orderBy: [{ field: "created_at", direction: "desc" }],
          }}
        >
          <Empty><EmptyState title="收件箱为空" icon="check-circle"/></Empty>
          <Item>
            <Card>
              <HStack justify="between" gap={8}>
                <VStack gap={4}>
                  <Heading level={3}>{item.title}</Heading>
                  {item.tag && <Tag label={item.tag} color="primary"/>}
                </VStack>
                <Button
                  label="归档"
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

    <Tab value="archive" label="归档" icon="archive">
      <Section title="已归档">
        <DataList
          collection="notes"
          query={{ where: { archived: true }, orderBy: [{ field: "created_at", direction: "desc" }] }}
        >
          <Empty><EmptyState title="归档为空"/></Empty>
          <Item>
            <Card>
              <HStack justify="between" gap={8}>
                <VStack gap={4}>
                  <Text muted>✓ {item.title}</Text>
                  {item.tag && <Tag label={item.tag} color="default"/>}
                </VStack>
                <HStack gap={4}>
                  <Button
                    label="恢复"
                    color="primary"
                    leftIcon="arrow-counter-clockwise"
                    onClick={() => data.update({
                      collection: "notes",
                      id: item.id,
                      patch: { archived: false },
                    })}
                  />
                  <Button
                    label="删除"
                    color="danger"
                    leftIcon="trash"
                    onClick={() => app.confirm({
                      title: "删除这条记录？",
                      description: "无法恢复。",
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
