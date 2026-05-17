<Page>
  <Tabs id="main" defaultValue="review" position="bottom">
    <Tab value="review" label={t.tabReview} icon="cards-three">
      <DataList
        collection="cards"
        query={{ where: { level: 0 }, orderBy: [{ field: "created_at", direction: "asc" }] }}
      >
        <Empty>
          <EmptyState
            title={t.emptyReviewTitle}
            description={t.emptyReviewDesc}
            icon="check-circle"/>
        </Empty>
        <Item>
          <Card>
            <VStack gap={6}>
              <VStack gap={2} className="items-center py-6">
                <Heading level={1} className="text-4xl text-center">{item.front}</Heading>
                {item.reading && <Text muted className="text-sm">{item.reading}</Text>}
              </VStack>
              <Divider/>
              <Text className="text-center whitespace-pre-wrap py-4">{item.back}</Text>
              <HStack justify="between" gap={8}>
                <Button label={t.btnAgain} icon="arrow-counter-clockwise"
                  onClick={() => data.update({
                    collection: "cards", id: item.id, patch: { level: 0 },
                  })}/>
                <Button label={t.btnGotIt} color="primary" icon="check"
                  onClick={() => data.update({
                    collection: "cards", id: item.id, patch: { level: 1, next_review: now },
                  })}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="all" label={t.tabAll} icon="list">
      <DataList
        collection="cards"
        query={{ orderBy: [{ field: "level", direction: "asc" }], limit: 200 }}
      >
        <Empty><EmptyState title={t.emptyAllTitle} icon="cards"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4} className="flex-1">
                <HStack gap={6} className="items-center">
                  <Heading level={3}>{item.front}</Heading>
                  {item.reading && <Text muted className="text-xs">{item.reading}</Text>}
                  <Badge content={item.level} color={item.level == 0 ? "warning" : "success"}
                    icon={item.level == 0 ? "circle" : "check-circle"}/>
                </HStack>
                <Text muted className="text-xs whitespace-pre-wrap">{item.back}</Text>
              </VStack>
              <HStack gap={4}>
                <Button label={t.btnReset} icon="arrow-counter-clockwise" size="sm"
                  onClick={() => data.update({
                    collection: "cards", id: item.id, patch: { level: 0 },
                  })}/>
                <Button label={t.btnDelete} icon="trash" color="danger" size="sm"
                  onClick={() => data.delete({ collection: "cards", id: item.id })}/>
              </HStack>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="add" label={t.tabAdd} icon="plus">
      <Card>
        <DataForm collection="cards">
          <Input name="front" label={t.labelFront} placeholder={t.frontPlaceholder}/>
          <Input name="reading" label={t.labelReading} placeholder={t.readingPlaceholder}/>
          <Textarea name="back" label={t.labelBack} placeholder={t.backPlaceholder} rows={3}/>
          <HStack justify="end">
            <Button
              label={t.btnAdd}
              color="primary"
              icon="plus"
              disabled={!form.front}
              onClick={() => data.create({
                collection: "cards",
                data: {
                  front: form.front,
                  reading: form.reading,
                  back: form.back,
                  level: 0,
                  created_at: now,
                },
              })}
            />
          </HStack>
        </DataForm>
      </Card>
    </Tab>
  </Tabs>
</Page>
