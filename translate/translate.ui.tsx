<Page className="p-4">
  <VStack gap={8}>
    <DataForm collection="scratch">
      <HStack gap={6}>
        <Select name="target" placeholder="目标语言">
          <Option value="zh" label="中文"/>
          <Option value="en" label="English"/>
          <Option value="ja" label="日本語"/>
          <Option value="ko" label="한국어"/>
          <Option value="fr" label="Français"/>
          <Option value="de" label="Deutsch"/>
        </Select>
      </HStack>
      <Textarea
        name="input"
        label=""
        placeholder="粘贴要翻译的文字"
        rows={6}
        className="text-sm"
      />
      <HStack justify="end" gap={6}>
        <Button label="清空结果" icon="x"
          onClick={() => scripts.clear()}/>
        <Button label="翻译" color="primary" icon="translate"
          disabled={!form.input}
          onClick={() => scripts.translate({input: form.input, target: form.target})}/>
      </HStack>
    </DataForm>

    {state.loading && (
      <Text muted className="text-xs">翻译中…</Text>
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
