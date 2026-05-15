<Page className="p-6">
  <VStack gap={6}>
    <Section title="生成 QR">
      <DataForm collection="scratch">
        <Input name="text" label="文字" placeholder="输入要编码的文字..."/>
        <HStack justify="end">
          <Button label="生成" color="primary" icon="qr-code"
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

    <Section title="解码 QR (剪贴板里有 QR 图片)">
      <HStack justify="end">
        <Button label="粘贴解码" color="primary" icon="scan"
          onClick={() => scripts.scan()}/>
      </HStack>
      {state.decoded && (
        <Card>
          <Text content={state.decoded}/>
        </Card>
      )}
    </Section>

    {state.error && (
      <Card className="border border-red-500/30">
        <Text content={state.error} className="text-red-500"/>
      </Card>
    )}
  </VStack>
</Page>
