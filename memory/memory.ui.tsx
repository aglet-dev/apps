<Page title="Memory">
  <Section title="📌 已固定">
    <DataList
      collection="memories"
      query={{ where: { pinned: true }, orderBy: [{ field: "created_at", direction: "desc" }] }}
    >
      <Empty><EmptyState title="还没有固定的记忆" icon="push-pin"/></Empty>
      <Item>
        <Card>
          <VStack gap={4}>
            <HStack gap={6}>
              <Badge content={item.kind} color="primary"/>
              <Text muted>{item.project} · {item.agent}</Text>
            </HStack>
            <Text>{item.text}</Text>
            {item.tags && <Text muted>#{item.tags}</Text>}
            <HStack justify="end" gap={8}>
              <Button
                label="取消固定"
                leftIcon="push-pin-slash"
                onClick={() => data.update({
                  collection: "memories",
                  id: item.id,
                  patch: { pinned: false },
                })}
              />
              <Button
                label="忘记"
                color="danger"
                leftIcon="trash"
                onClick={() => app.confirm({
                  title: "永久忘记这条记忆？",
                  description: "无法恢复。",
                  color: "danger",
                  onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                })}
              />
            </HStack>
          </VStack>
        </Card>
      </Item>
    </DataList>
  </Section>

  <Section title="所有记忆">
    <DataList
      collection="memories"
      query={{ where: { pinned: false }, orderBy: [{ field: "created_at", direction: "desc" }] }}
      paginate={{ pageSize: 20 }}
    >
      <Empty>
        <EmptyState
          title="还没有记忆"
          description="Agent 在工作中会自动写入这里。"
          icon="brain"
        />
      </Empty>
      <Item>
        <Card>
          <VStack gap={4}>
            <HStack gap={6}>
              <Badge content={item.kind} color="default"/>
              <Text muted>{item.project} · {item.agent}</Text>
            </HStack>
            <Text>{item.text}</Text>
            {item.tags && <Text muted>#{item.tags}</Text>}
            <HStack justify="end" gap={8}>
              <Button
                label="固定"
                leftIcon="push-pin"
                onClick={() => data.update({
                  collection: "memories",
                  id: item.id,
                  patch: { pinned: true },
                })}
              />
              <Button
                label="忘记"
                color="danger"
                leftIcon="trash"
                onClick={() => app.confirm({
                  title: "永久忘记这条记忆？",
                  description: "无法恢复。",
                  color: "danger",
                  onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                })}
              />
            </HStack>
          </VStack>
        </Card>
      </Item>
    </DataList>
  </Section>
</Page>
