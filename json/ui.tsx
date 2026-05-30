<Page className="p-4">
  <VStack gap={8}>
    <DataForm collection="scratch">
      <Textarea
        name="input"
        label={t.inputLabel}
        placeholder={t.inputPlaceholder}
        rows={8}
        className="font-mono text-xs"
      />
      <HStack gap={6} justify="end">
        <Button label={t.btnClear} icon="x" size="sm"
          onClick={() => scripts.clear()}/>
        <Button label={t.btnValidate} icon="check" size="sm"
          onClick={() => scripts.validate({input: form.input})}/>
        <Button label={t.btnMinify} icon="arrows-in-line-horizontal" size="sm"
          onClick={() => scripts.minify({input: form.input})}/>
        <Button label={t.btnFormat} color="primary" icon="brackets-curly"
          onClick={() => scripts.format({input: form.input})}/>
      </HStack>
    </DataForm>

    {state.info && (
      <HStack gap={4} className="items-center px-2">
        <Badge content={state.info} color="success"/>
      </HStack>
    )}

    {state.error && (
      <Alert title={t.errorTitle} description={state.error} color="danger" icon="warning"/>
    )}

    {state.output && (
      <Section title={t.outputTitle}>
        <Card>
          <Text className="font-mono text-xs whitespace-pre-wrap">{state.output}</Text>
        </Card>
      </Section>
    )}
  </VStack>
</Page>
