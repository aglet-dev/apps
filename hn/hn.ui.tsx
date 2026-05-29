<Page>
  <Tabs id="main" defaultValue="feed" position="bottom">
    <Tab value="feed" label={t.tabFeed} icon="fire">
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
            title={t.emptyFeedTitle}
            description={t.emptyFeedDesc}
            icon="newspaper"
          />
        </Empty>
        <Item>
          <Card>
            <VStack gap={6}>
              <HStack justify="between" gap={6}>
                <Heading level={3}>🎯 {item.title || item.title_en}</Heading>
                <Badge content={item.points} color="warning" icon="fire"/>
              </HStack>
              <HStack gap="sm">
                <Avatar name={item.author} size="sm"/>
                <Text muted>
                  {item.domain} · {item.author} · {item.age} · 💬 {item.comments}
                </Text>
              </HStack>
              <Text>{item.summary}</Text>
              <HStack justify="end" gap={8}>
                <Tooltip content={item.url}>
                  <Link label={t.btnSource} icon="link" href={item.url}/>
                </Tooltip>
                <Tooltip content={t.tipLike}>
                  <Button
                    label={t.btnLike}
                    icon="heart"
                    pressed={item.liked}
                    onClick={() => data.update({
                      collection: "stories",
                      id: item.id,
                      patch: { liked: !item.liked, disliked: false },
                    })}
                  />
                </Tooltip>
                <Tooltip content={t.tipBlock}>
                  <Button
                    label={t.btnBlock}
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

    <Tab value="liked" label={t.tabLiked} icon="heart">
      <DataList
        collection="stories"
        query={{ where: { liked: true }, orderBy: [{ field: "points", direction: "desc" }] }}
      >
        <Empty><EmptyState title={t.emptyLikedTitle} icon="heart-break"/></Empty>
        <Item>
          <Card>
            <VStack gap={4}>
              <Heading level={3}>{item.title || item.title_en}</Heading>
              <Text muted>{item.domain} · {item.points} {t.points}</Text>
              <Text>{item.summary}</Text>
              <HStack justify="end" gap={8}>
                <Link label={t.btnSource} icon="link" href={item.url}/>
                <Button
                  label={t.btnUnlike}
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

    <Tab value="blocked" label={t.tabBlocked} icon="prohibit">
      <DataList collection="stories" query={{ where: { disliked: true } }}>
        <Empty><EmptyState title={t.emptyBlockedTitle}/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={2}>
                <Text muted>{item.title || item.title_en}</Text>
                <Text muted>{item.domain}</Text>
              </VStack>
              <Button
                label={t.btnRestore}
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
