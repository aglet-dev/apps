<Page>
  <Tabs id="main" defaultValue="now" position="bottom">
    <Tab value="now" label={t.tabNow} icon="translate">
      <DataForm collection="scratch">
        <HStack gap={6}>
          <Select name="target" label={t.labelTarget} placeholder={t.targetPlaceholder}>
            <Option value="zh" label="中文"/>
            <Option value="en" label="English"/>
            <Option value="ja" label="日本語"/>
            <Option value="ko" label="한국어"/>
            <Option value="fr" label="Français"/>
            <Option value="de" label="Deutsch"/>
          </Select>
        </HStack>
        <Textarea name="input" label={t.labelInput} rows={6}
          placeholder={t.inputPlaceholder} className="text-sm"/>
        <HStack justify="end" gap={6}>
          <Button label={t.btnClear} icon="x" size="sm"
            onClick={() => scripts.clear()}/>
          <Button label={t.btnTranslate} color="primary" icon="translate"
            disabled={!form.input}
            onClick={() => scripts.translate({input: form.input, target: form.target})}/>
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
        query={{ orderBy: [{ field: "created_at", direction: "desc" }], limit: 100 }}
      >
        <Empty><EmptyState title={t.emptyHistory} icon="clock"/></Empty>
        <Item>
          <Card>
            <VStack gap={4}>
              <HStack gap={6} className="items-center">
                <Badge content={item.target} color="primary" icon="translate"/>
                {item.created_at && <Text muted className="text-xs">{item.created_at | relative}</Text>}
              </HStack>
              <Text muted className="text-xs whitespace-pre-wrap">{item.input}</Text>
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
