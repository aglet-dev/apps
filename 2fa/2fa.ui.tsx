<Page>
  <Card>
    <VStack gap={6}>
      <Heading level={3}>{t.addTitle}</Heading>
      <Textarea
        bind="/state/add_uri"
        placeholder="otpauth://totp/GitHub:alice?secret=JBSW...&issuer=GitHub"
        rows={2}/>
      <HStack justify="between" gap={6}>
        <Text muted className="text-xs">{t.addHint}</Text>
        <Button
          label={t.addBtn}
          color="primary"
          icon="plus"
          disabled={!state.add_uri}
          onClick={() => scripts.addFromUri()}/>
      </HStack>
      {state.add_err && (
        <Text className="text-xs text-red-500">{{op:"state", path:"/state/add_err"}}</Text>
      )}
    </VStack>
  </Card>

  <DataList
    collection="accounts"
    query={{ orderBy: [{ field: "created_at", direction: "desc" }] }}>
    <Empty><EmptyState title={t.emptyTitle} icon="shield-check"/></Empty>
    <Item>
      <Card>
        <HStack justify="between" gap={12}>
          <VStack gap={4} className="flex-1 min-w-0">
            <Heading level={4} className="truncate">{item.issuer || item.account}</Heading>
            {item.issuer && item.account && (
              <Text muted className="text-xs truncate">{item.account}</Text>
            )}
            <Text className="text-2xl font-mono tabular-nums tracking-widest">{item.current_code}</Text>
          </VStack>
          <VStack gap={4} className="items-end">
            <Badge content={$countdown(item.period)} color="primary" icon="clock"/>
            <Button
              icon="trash"
              variant="ghost"
              onClick={() => scripts.remove({ id: item.id })}/>
          </VStack>
        </HStack>
      </Card>
    </Item>
  </DataList>
</Page>
