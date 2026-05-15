<Page>
  <Tabs defaultValue="review" position="bottom">
    <Tab value="review" label="Review" icon="eye">
      <DataList
        collection="prs"
        query={{ where: { reviewed_by_me: true, state: "open" }, orderBy: [{ field: "updated_at", direction: "desc" }] }}
      >
        <Empty><EmptyState title="没有等你 review 的 PR" description="等下一轮 scheduler tick 刷新" icon="check-circle"/></Empty>
        <Item>
          <Card>
            <VStack gap={6}>
              <HStack gap={6} justify="between">
                <Text muted>{item.repo} #{item.number}</Text>
                {item.is_draft && <Text muted className="text-xs uppercase tracking-wider">draft</Text>}
              </HStack>
              <Heading level={3}>{item.title}</Heading>
              <Text muted>by {item.author} · {item.updated_at | relative} · 💬 {item.comments_count}</Text>
              {item.labels && <Text muted className="text-xs">{item.labels}</Text>}
              <HStack justify="end" gap={8}>
                <Link label="在 GitHub 打开" icon="arrow-square-out" href={item.url}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="mine" label="我的" icon="user">
      <DataList
        collection="prs"
        query={{ where: { authored_by_me: true, state: "open" }, orderBy: [{ field: "updated_at", direction: "desc" }] }}
      >
        <Empty><EmptyState title="你没有 open 状态的 PR" icon="git-pull-request"/></Empty>
        <Item>
          <Card>
            <VStack gap={6}>
              <HStack gap={6} justify="between">
                <Text muted>{item.repo} #{item.number}</Text>
                {item.is_draft && <Text muted className="text-xs uppercase tracking-wider">draft</Text>}
              </HStack>
              <Heading level={3}>{item.title}</Heading>
              <Text muted>{item.updated_at | relative} · 💬 {item.comments_count}</Text>
              {item.labels && <Text muted className="text-xs">{item.labels}</Text>}
              <HStack justify="end" gap={8}>
                <Link label="在 GitHub 打开" icon="arrow-square-out" href={item.url}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="all" label="全部" icon="list">
      <DataList
        collection="prs"
        query={{ where: { state: "open" }, orderBy: [{ field: "updated_at", direction: "desc" }], limit: 100 }}
      >
        <Empty><EmptyState title="暂无 open PR" icon="git-pull-request"/></Empty>
        <Item>
          <Card>
            <VStack gap={4}>
              <Text muted>{item.repo} #{item.number} · by {item.author}</Text>
              <Text>{item.title}</Text>
              <Text muted>{item.updated_at | relative}</Text>
              <HStack justify="end">
                <Link label="查看" icon="arrow-square-out" href={item.url}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>
  </Tabs>
</Page>
