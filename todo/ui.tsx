<Page className="p-5 flex flex-col gap-4">
  <Heading level={1}>{t.heading}</Heading>

  <DataForm collection="todos">
    <HStack gap={3} className="items-end">
      <Input name="title" placeholder={t.placeholder} className="flex-1"/>
      <Button label={t.btnAdd} color="primary" disabled={!form.title}
        onClick={() => data.create({ collection: "todos", data: { title: form.title, done: false, created_at: now } })}/>
    </HStack>
  </DataForm>

  <DataList collection="todos" query={{ orderBy: [{ field: "created_at", direction: "desc" }] }}>
    <Empty><EmptyState title={t.empty} icon="check-circle"/></Empty>
    <Item>
      <HStack justify="between" gap={6} className="items-center py-1">
        <Text className={item.done ? "line-through opacity-50" : ""}>{item.title}</Text>
        <HStack gap={2}>
          <Button label={item.done ? t.btnUndo : t.btnDone} size="sm"
            onClick={() => data.update({ collection: "todos", id: item.id, patch: { done: !item.done } })}/>
          <Button label={t.btnDelete} size="sm" color="danger"
            onClick={() => data.delete({ collection: "todos", id: item.id })}/>
        </HStack>
      </HStack>
    </Item>
  </DataList>
</Page>
