<Page>
  <Tabs id="main" defaultValue="now" position="bottom">
    <Tab value="now" label={t.tabNow} icon="sparkle">
      <DataForm collection="scratch">
        <Input name="name" label={t.labelName} placeholder={t.namePlaceholder}/>
        <Textarea name="selling_points" label={t.labelSellingPoints} rows={3}
          placeholder={t.sellingPointsPlaceholder}/>
        <HStack gap={6}>
          <Input name="audience" label={t.labelAudience} placeholder={t.audiencePlaceholder}/>
          <Input name="platform" label={t.labelPlatform} placeholder={t.platformPlaceholder}/>
        </HStack>
        <Select name="tone" label={t.labelTone} placeholder={t.tonePlaceholder}>
          <Option value="professional" label={t.toneProfessional}/>
          <Option value="playful" label={t.tonePlayful}/>
          <Option value="minimal" label={t.toneMinimal}/>
          <Option value="story" label={t.toneStory}/>
        </Select>
        <HStack justify="end" gap={6}>
          <Button label={t.btnClear} icon="x" size="sm"
            onClick={() => scripts.clear()}/>
          <Button label={t.btnGenerate} color="primary" icon="sparkle"
            disabled={!form.name}
            onClick={() => scripts.generate({
              name: form.name,
              selling_points: form.selling_points,
              audience: form.audience,
              platform: form.platform,
              tone: form.tone,
            })}/>
        </HStack>
      </DataForm>

      {state.loading && (
        <Text muted className="text-xs">{t.loading}</Text>
      )}

      {state.error && (
        <Alert title={t.errorTitle} description={state.error} color="danger" icon="warning"/>
      )}

      {state.output && (
        <Card>
          <Text className="text-sm whitespace-pre-wrap">{state.output}</Text>
        </Card>
      )}
    </Tab>

    <Tab value="history" label={t.tabHistory} icon="clock-counter-clockwise">
      <DataList
        collection="history"
        query={{ orderBy: [{ field: "created_at", direction: "desc" }], limit: 50 }}
      >
        <Empty><EmptyState title={t.emptyHistory} icon="clock"/></Empty>
        <Item>
          <Card>
            <VStack gap={4}>
              <HStack gap={6} justify="between">
                <Heading level={3}>{item.name}</Heading>
                {item.tone && <Badge content={item.tone} color="primary" icon="palette"/>}
              </HStack>
              <HStack gap={6} className="items-center">
                {item.audience && <Text muted className="text-xs">{item.audience}</Text>}
                {item.platform && <Text muted className="text-xs">#{item.platform}</Text>}
                {item.created_at && <Text muted className="text-xs">{item.created_at | relative}</Text>}
              </HStack>
              <Divider/>
              <Text className="text-sm whitespace-pre-wrap">{item.output}</Text>
              <HStack justify="end">
                <Button label={t.btnDelete} icon="trash" color="danger" size="sm"
                  onClick={() => data.delete({ collection: "history", id: item.id })}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>
  </Tabs>
</Page>
