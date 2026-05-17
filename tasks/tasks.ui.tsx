<Page>
  <Tabs id="main" defaultValue="todo" position="bottom">
    <Tab value="todo" label={t.tabTodo} icon="circle">
      <Card>
        <DataForm collection="items">
          <Input name="title" label={t.labelTitle} placeholder={t.titlePlaceholder}/>
          <HStack gap={6}>
            <Select name="priority" label={t.labelPriority} placeholder={t.priorityPlaceholder}>
              <Option value="high" label={t.priorityHigh}/>
              <Option value="med" label={t.priorityMed}/>
              <Option value="low" label={t.priorityLow}/>
            </Select>
            <Input name="project" label={t.labelProject} placeholder={t.projectPlaceholder}/>
          </HStack>
          <Input name="due_at" label={t.labelDue} placeholder={t.duePlaceholder}/>
          <Textarea name="notes" label={t.labelNotes} placeholder={t.notesPlaceholder} rows={2}/>
          <HStack justify="end">
            <Button
              label={t.btnAdd}
              color="primary"
              icon="plus"
              disabled={!form.title}
              onClick={() => data.create({
                collection: "items",
                data: {
                  title: form.title,
                  notes: form.notes,
                  project: form.project,
                  priority: form.priority,
                  due_at: form.due_at,
                  status: "todo",
                  created_at: now,
                },
              })}
            />
          </HStack>
        </DataForm>
      </Card>

      <DataList
        collection="items"
        query={{ where: { status: "todo" }, orderBy: [{ field: "due_at", direction: "asc" }] }}
      >
        <Empty><EmptyState title={t.emptyTodo} icon="check-circle"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4} className="flex-1">
                <HStack gap={6} className="items-center">
                  {item.priority && <Badge content={item.priority} color="warning"/>}
                  {item.project && <Text muted className="text-xs">#{item.project}</Text>}
                </HStack>
                <Heading level={3}>{item.title}</Heading>
                {item.notes && <Text muted className="text-xs">{item.notes}</Text>}
                {item.due_at && <Text muted className="text-xs">{t.metaDue} {item.due_at | relative}</Text>}
              </VStack>
              <HStack gap={4}>
                <Button
                  label={t.btnStart}
                  icon="play"
                  size="sm"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { status: "doing" },
                  })}
                />
                <Button
                  label={t.btnComplete}
                  icon="check"
                  color="primary"
                  size="sm"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { status: "done", completed_at: now },
                  })}
                />
              </HStack>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="doing" label={t.tabDoing} icon="play-circle">
      <DataList
        collection="items"
        query={{ where: { status: "doing" }, orderBy: [{ field: "due_at", direction: "asc" }] }}
      >
        <Empty><EmptyState title={t.emptyDoing} icon="coffee"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4} className="flex-1">
                <HStack gap={6} className="items-center">
                  {item.priority && <Badge content={item.priority} color="warning"/>}
                  {item.project && <Text muted className="text-xs">#{item.project}</Text>}
                </HStack>
                <Heading level={3}>{item.title}</Heading>
                {item.due_at && <Text muted className="text-xs">{t.metaDue} {item.due_at | relative}</Text>}
              </VStack>
              <HStack gap={4}>
                <Button
                  label={t.btnPause}
                  icon="pause"
                  size="sm"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { status: "todo" },
                  })}
                />
                <Button
                  label={t.btnComplete}
                  icon="check"
                  color="primary"
                  size="sm"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { status: "done", completed_at: now },
                  })}
                />
              </HStack>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="done" label={t.tabDone} icon="check-circle">
      <DataList
        collection="items"
        query={{ where: { status: "done" }, orderBy: [{ field: "completed_at", direction: "desc" }] }}
      >
        <Empty><EmptyState title={t.emptyDone} icon="trophy"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4} className="flex-1">
                <HStack gap={4} className="items-center">
                  <Badge content="" color="success" icon="check"/>
                  <Text muted className="line-through">{item.title}</Text>
                </HStack>
                {item.completed_at && <Text muted className="text-xs">{item.completed_at | relative}</Text>}
              </VStack>
              <HStack gap={4}>
                <Button
                  label={t.btnUndo}
                  icon="arrow-counter-clockwise"
                  size="sm"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { status: "todo", completed_at: "" },
                  })}
                />
                <Button
                  label={t.btnDelete}
                  icon="trash"
                  color="danger"
                  size="sm"
                  onClick={() => data.delete({ collection: "items", id: item.id })}
                />
              </HStack>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>
  </Tabs>
</Page>
