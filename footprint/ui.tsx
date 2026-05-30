<Page>
  <Card title={t.cardMap}>
    <Map
      collection="places"
      query={{ orderBy: [{ field: "visited_at", direction: "asc" }] }}
      latField="lat"
      lngField="lng"
      labelField="name"
      polyline={true}
      height={360}
    />
  </Card>

  <Card title={t.cardNew}>
    <DataForm collection="places">
      <Input name="name" label={t.labelName} placeholder={t.namePlaceholder}/>
      <HStack gap={8}>
        <NumberField name="lat" label={t.labelLat} placeholder="35.6812" step={0.0001}/>
        <NumberField name="lng" label={t.labelLng} placeholder="139.7671" step={0.0001}/>
      </HStack>
      <Input name="note" label={t.labelNote} placeholder={t.notePlaceholder}/>
      <HStack justify="end">
        <Button
          label={t.btnAdd}
          color="primary"
          leftIcon="plus"
          disabled={!form.name}
          onClick={() => data.create({
            collection: "places",
            data: {
              name: form.name,
              lat: form.lat,
              lng: form.lng,
              visited_at: now,
              note: form.note,
            },
          })}
        />
      </HStack>
    </DataForm>
  </Card>

  <Section title={t.sectionHistory}>
    <DataList
      collection="places"
      query={{ orderBy: [{ field: "visited_at", direction: "desc" }] }}
      paginate={{ pageSize: 20 }}
    >
      <Empty>
        <EmptyState
          title={t.emptyTitle}
          description={t.emptyDesc}
          icon="map-pin"
        />
      </Empty>
      <Item>
        <Card>
          <HStack justify="between" gap={8}>
            <VStack gap={4}>
              <Heading level={3}>{item.name}</Heading>
              <Text muted>{item.lat}, {item.lng}</Text>
              {item.note && <Text muted>{item.note}</Text>}
            </VStack>
            <Button
              label={t.btnDelete}
              color="danger"
              leftIcon="trash"
              size="sm"
              onClick={() => data.delete({ collection: "places", id: item.id })}
            />
          </HStack>
        </Card>
      </Item>
    </DataList>
  </Section>
</Page>
