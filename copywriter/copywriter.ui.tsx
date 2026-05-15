<Page className="p-4">
  <VStack gap={8}>
    <DataForm collection="scratch">
      <Input name="name" label="" placeholder="商品名（必填）"/>
      <Textarea name="selling_points" label="" rows={3}
        placeholder="卖点 / 功能 / 差异点（一行一条）"/>
      <HStack gap={6}>
        <Input name="audience" label="" placeholder="目标受众（例：25-35 都市白领）"/>
        <Input name="platform" label="" placeholder="平台（小红书 / 淘宝 / 京东…）"/>
      </HStack>
      <Select name="tone" placeholder="语调">
        <Option value="professional" label="专业"/>
        <Option value="playful" label="活泼"/>
        <Option value="minimal" label="简洁"/>
        <Option value="story" label="故事化"/>
      </Select>
      <HStack justify="end" gap={6}>
        <Button label="清空" icon="x"
          onClick={() => scripts.clear()}/>
        <Button label="生成 3 条" color="primary" icon="sparkle"
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
      <Text muted className="text-xs">生成中…</Text>
    )}

    {state.error && (
      <Card className="border border-red-500/40 bg-red-500/5">
        <Text className="text-red-500 text-sm font-mono">{state.error}</Text>
      </Card>
    )}

    {state.output && (
      <Card>
        <Text className="text-sm whitespace-pre-wrap">{state.output}</Text>
      </Card>
    )}
  </VStack>
</Page>
