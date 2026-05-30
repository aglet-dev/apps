<Page>
  <Tabs id="main" defaultValue="review" position="bottom">
    <Tab value="review" label={t.tabReview} icon="eye">
      <DataList
        collection="prs"
        query={{ where: { reviewed_by_me: true, state: "open" }, orderBy: [{ field: "updated_at", direction: "desc" }] }}
      >
        <Empty><EmptyState title={t.emptyReviewTitle} description={t.emptyReviewDesc} icon="check-circle"/></Empty>
        <Item>
          <Card>
            <VStack gap={6}>
              <HStack gap={6} justify="between" className="items-center">
                <Text muted>{item.repo} #{item.number}</Text>
                {item.is_draft && <Badge content={t.draftTag} icon="pencil-line"/>}
              </HStack>
              <Heading level={3}>{item.title}</Heading>
              <HStack gap={3} className="items-center">
                <Avatar name={item.author} size="sm"/>
                <Text muted>{t.byAuthor} {item.author} · {item.updated_at | relative} · 💬 {item.comments_count}</Text>
              </HStack>
              {item.labels && <Text muted className="text-xs">{item.labels}</Text>}
              <HStack justify="end" gap={8}>
                <Link label={t.btnOpenGithub} icon="arrow-square-out" href={item.url}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="mine" label={t.tabMine} icon="user">
      <DataList
        collection="prs"
        query={{ where: { authored_by_me: true, state: "open" }, orderBy: [{ field: "updated_at", direction: "desc" }] }}
      >
        <Empty><EmptyState title={t.emptyMineTitle} icon="git-pull-request"/></Empty>
        <Item>
          <Card>
            <VStack gap={6}>
              <HStack gap={6} justify="between" className="items-center">
                <Text muted>{item.repo} #{item.number}</Text>
                {item.is_draft && <Badge content={t.draftTag} icon="pencil-line"/>}
              </HStack>
              <Heading level={3}>{item.title}</Heading>
              <Text muted>{item.updated_at | relative} · 💬 {item.comments_count}</Text>
              {item.labels && <Text muted className="text-xs">{item.labels}</Text>}
              <HStack justify="end" gap={8}>
                <Link label={t.btnOpenGithub} icon="arrow-square-out" href={item.url}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="all" label={t.tabAll} icon="list">
      <DataList
        collection="prs"
        query={{ where: { state: "open" }, orderBy: [{ field: "updated_at", direction: "desc" }], limit: 100 }}
      >
        <Empty><EmptyState title={t.emptyAllTitle} icon="git-pull-request"/></Empty>
        <Item>
          <Card>
            <VStack gap={4}>
              <Text muted>{item.repo} #{item.number} · {t.byAuthor} {item.author}</Text>
              <Text>{item.title}</Text>
              <Text muted>{item.updated_at | relative}</Text>
              <HStack justify="end">
                <Link label={t.btnView} icon="arrow-square-out" href={item.url}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>
  </Tabs>
</Page>
