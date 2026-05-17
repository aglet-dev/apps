<Page className="p-6">
  <VStack gap={6}>
    <Section title={t.sectionEncode}>
      <DataForm collection="scratch">
        <Input name="text" label={t.labelText} placeholder={t.textPlaceholder}/>
        <HStack justify="end">
          <Button label={t.btnEncode} color="primary" icon="qr-code"
            onClick={() => scripts.encode({text: form.text})}/>
        </HStack>
      </DataForm>
      {state.qr && (
        <Card>
          <Image src={state.qr} fit="contain" className="w-full max-w-xs mx-auto"/>
        </Card>
      )}
    </Section>

    <Divider/>

    <Section title={t.sectionDecode}>
      <HStack justify="end">
        <Button label={t.btnPaste} color="primary" icon="scan"
          onClick={() => scripts.scan()}/>
      </HStack>
      {state.decoded && (
        <Card>
          <Text content={state.decoded}/>
        </Card>
      )}
    </Section>

    {state.error && (
      <Alert title={t.errorTitle} description={state.error} color="danger" icon="warning"/>
    )}
  </VStack>
</Page>
