<Page className="p-6">
  <VStack gap={6}>
    <Section title="Source">
      <DataForm collection="scratch">
        <Input name="src_dataurl" label="Image data URL" placeholder="data:image/...;base64,..."/>
      </DataForm>
      {form.src_dataurl && <Image src={form.src_dataurl} fit="contain" className="max-w-full max-h-48 mx-auto"/>}
      {state.src_meta && <Text content={state.src_meta} className="text-sm text-muted"/>}
    </Section>

    <Section title="Convert">
      <DataForm collection="scratch">
        <Select name="format" label="Output" placeholder="webp">
          <Option value="webp" label="WebP"/>
          <Option value="png"  label="PNG"/>
          <Option value="jpeg" label="JPEG"/>
          <Option value="bmp"  label="BMP"/>
        </Select>
        <Input name="quality" label="Quality (1-100)" type="number" placeholder="85"/>
        <HStack justify="end">
          <Button label="Convert" color="primary" icon="arrow-right"
            onClick={() => scripts.convert({
              src_dataurl: form.src_dataurl,
              format: form.format,
              quality: form.quality,
            })}/>
        </HStack>
      </DataForm>
    </Section>

    {state.out_dataurl && (
      <Section title="Result">
        <Image src={state.out_dataurl} fit="contain" className="max-w-full max-h-48 mx-auto"/>
        <Text content={state.out_meta} className="text-sm text-muted"/>
        <HStack justify="end">
          <Button label="Copy to clipboard" icon="copy" onClick={() => scripts.copyOut()}/>
        </HStack>
      </Section>
    )}

    {state.error && (
      <Alert title="Error" description={state.error} color="danger" icon="warning"/>
    )}
  </VStack>
</Page>
