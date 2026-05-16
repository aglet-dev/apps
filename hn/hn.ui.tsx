<Page>
  <Tabs defaultValue="feed" position="bottom">
    <Tab value="feed" label="首页" icon="fire">
      <DataList
        collection="stories"
        query={{
          where: { disliked: false },
          orderBy: [{ field: "hn_id", direction: "desc" }],
          limit: 50,
        }}
        paginate={{ pageSize: 20 }}
      >
        <Empty>
          <EmptyState
            title="还没有内容"
            description="让 Agent 拉一次 HN：「刷新一下 HN」"
            icon="newspaper"
          />
        </Empty>
        <Item>
          <Card>
            <VStack gap={6}>
              <HStack justify="between" gap={6}>
                <Heading level={3}>{item.title_zh}</Heading>
                <Badge content={item.points} color="warning" icon="fire"/>
              </HStack>
              <HStack gap="sm">
                <Avatar name={item.author} size="sm"/>
                <Text muted>
                  {item.domain} · {item.author} · {item.age} · 💬 {item.comments}
                </Text>
              </HStack>
              <Text>{item.summary_zh}</Text>
              <HStack justify="end" gap={8}>
                <Tooltip content={item.url}>
                  <Link label="原文" icon="link" href={item.url}/>
                </Tooltip>
                <Tooltip content="加入喜欢列表（首页隐藏屏蔽列表）">
                  <Button
                    label="喜欢"
                    icon="heart"
                    pressed={item.liked}
                    onClick={() => data.update({
                      collection: "stories",
                      id: item.id,
                      patch: { liked: !item.liked, disliked: false },
                    })}
                  />
                </Tooltip>
                <Tooltip content="不再在首页看到此条；可在「屏蔽」tab 恢复">
                  <Button
                    label="屏蔽"
                    icon="prohibit"
                    color="danger"
                    onClick={() => data.update({
                      collection: "stories",
                      id: item.id,
                      patch: { liked: false, disliked: true },
                    })}
                  />
                </Tooltip>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="liked" label="喜欢" icon="heart">
      <DataList
        collection="stories"
        query={{ where: { liked: true }, orderBy: [{ field: "points", direction: "desc" }] }}
      >
        <Empty><EmptyState title="还没有喜欢的内容" icon="heart-break"/></Empty>
        <Item>
          <Card>
            <VStack gap={4}>
              <Heading level={3}>{item.title_zh}</Heading>
              <Text muted>{item.domain} · {item.points} 分</Text>
              <Text>{item.summary_zh}</Text>
              <HStack justify="end" gap={8}>
                <Link label="原文" icon="link" href={item.url}/>
                <Button
                  label="取消喜欢"
                  onClick={() => data.update({
                    collection: "stories", id: item.id, patch: { liked: false },
                  })}
                />
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="blocked" label="屏蔽" icon="prohibit">
      <DataList collection="stories" query={{ where: { disliked: true } }}>
        <Empty><EmptyState title="屏蔽列表为空"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={2}>
                <Text muted>{item.title_zh}</Text>
                <Text muted>{item.domain}</Text>
              </VStack>
              <Button
                label="恢复"
                color="primary"
                onClick={() => data.update({
                  collection: "stories", id: item.id, patch: { disliked: false },
                })}
              />
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>
  </Tabs>
</Page>
