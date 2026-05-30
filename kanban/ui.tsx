<Page title="Kanban">
  <HStack justify="between" gap={6}>
    <Text muted>{t.intro}</Text>
    <Drawer id="filters"
      title={t.filter}
      description={t.filterDesc}
      side="right"
      trigger={<Button label={t.filter} leftIcon="funnel"/>}
    >
      <Heading level={3} content={t.assignee}/>
      <HStack gap={4}>
        <Button label={t.all} size="sm" pressed={!state.filterAssignee}
          onClick={() => setState("/state/filterAssignee", "")}/>
        <Button label="Ada" size="sm" pressed={state.filterAssignee == "Ada"}
          onClick={() => setState("/state/filterAssignee", "Ada")}/>
        <Button label="Linus" size="sm" pressed={state.filterAssignee == "Linus"}
          onClick={() => setState("/state/filterAssignee", "Linus")}/>
      </HStack>
      <Heading level={3} content={t.priority}/>
      <HStack gap={4}>
        <Button label={t.all} size="sm" pressed={!state.filterPriority}
          onClick={() => setState("/state/filterPriority", "")}/>
        <Button label={t.high} size="sm" pressed={state.filterPriority == "high"}
          onClick={() => setState("/state/filterPriority", "high")}/>
        <Button label={t.medium} size="sm" pressed={state.filterPriority == "medium"}
          onClick={() => setState("/state/filterPriority", "medium")}/>
        <Button label={t.low} size="sm" pressed={state.filterPriority == "low"}
          onClick={() => setState("/state/filterPriority", "low")}/>
      </HStack>
    </Drawer>
  </HStack>

  <HStack gap={4}>
    {state.filterAssignee && (
      <Tag label={state.filterAssignee ?? ""} color="primary" icon="user" removable
        onRemove={() => setState("/state/filterAssignee", "")}/>
    )}
    {state.filterPriority && (
      <Tag label={state.filterPriority ?? ""} color="warning" icon="funnel" removable
        onRemove={() => setState("/state/filterPriority", "")}/>
    )}
  </HStack>

  <Accordion id="cards" defaultOpen={["new"]}>
    <AccordionItem value="new" header={t.newCard} icon="plus-circle">
      <DataForm collection="cards">
        <Input name="title" label="" placeholder={t.titlePh}/>
        <HStack gap={6}>
          <Select name="priority" placeholder={t.priority}>
            <Option value="high" label={t.high}/>
            <Option value="medium" label={t.medium}/>
            <Option value="low" label={t.low}/>
          </Select>
          <Combobox name="assignee" placeholder={t.assignee}>
            <Option value="Ada" label="Ada Lovelace"/>
            <Option value="Linus" label="Linus Torvalds"/>
            <Option value="Grace" label="Grace Hopper"/>
          </Combobox>
          <NumberField name="effort" label="" placeholder={t.estimatePh} min={0} max={40} step={0.5}/>
        </HStack>
        <Textarea name="notes" label="" placeholder={t.notesPh} rows={2} autoResize/>
        <HStack justify="end">
          <Button
            label={t.create}
            color="primary"
            leftIcon="plus"
            disabled={!form.title}
            onClick={() => {
              data.create({
                collection: "cards",
                data: {
                  title: form.title,
                  notes: form.notes ?? "",
                  status: "backlog",
                  priority: form.priority ?? "medium",
                  assignee: form.assignee ?? "",
                  effort: form.effort ?? 0,
                  created_at: now,
                },
              });
              app.toast({ title: t.createdToast, color: "success" });
            }}
          />
        </HStack>
      </DataForm>
    </AccordionItem>
  </Accordion>

  <HStack gap={6} align="start">
    <VStack gap={6}>
      <HStack justify="between" gap={6}>
        <Heading level={3} content={t.backlog}/>
        <Badge content="backlog" color="default"/>
      </HStack>
      <DataList
        collection="cards"
        query={{
          where: {
            status: "backlog",
            ...(state.filterPriority && { priority: state.filterPriority }),
            ...(state.filterAssignee && { assignee: state.filterAssignee }),
          },
          orderBy: [{ field: "created_at", direction: "desc" }],
        }}
      >
        <Empty><EmptyState title={t.noBacklog} icon="check-circle"/></Empty>
        <Item>
          <Card>
            <VStack gap={4}>
              <HStack justify="between">
                <Heading level={3}>{item.title}</Heading>
                <Tag label={item.priority} color={item.priority == "high" ? "danger" : "warning"}/>
              </HStack>
              {item.assignee && (
                <HStack gap={6}>
                  <Avatar name={item.assignee} size="sm"/>
                  <Text muted>{item.assignee}</Text>
                </HStack>
              )}
              {item.notes && <Text muted>{item.notes}</Text>}
              {item.effort && <Meter value={item.effort} min={0} max={40} label={t.estimate} size="sm" color="primary"/>}
              <HStack justify="end" gap={4}>
                <Tooltip content={t.startTip}>
                  <Button label={t.start} size="sm" leftIcon="play"
                    onClick={() => data.update({ collection: "cards", id: item.id, patch: { status: "doing" } })}/>
                </Tooltip>
                <Menu id="actions" trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                  <MenuItem label={t.moveToDone} icon="check"
                    onClick={() => data.update({ collection: "cards", id: item.id, patch: { status: "done", completed_at: now } })}/>
                  <MenuItem separator/>
                  <MenuItem label={t.delete} icon="trash" danger
                    onClick={() => app.confirm({
                      title: t.deletePrompt,
                      color: "danger",
                      onConfirm: () => data.delete({ collection: "cards", id: item.id }),
                    })}/>
                </Menu>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </VStack>

    <VStack gap={6}>
      <HStack justify="between" gap={6}>
        <Heading level={3} content={t.doing}/>
        <Badge content="doing" color="warning"/>
      </HStack>
      <DataList
        collection="cards"
        query={{
          where: {
            status: "doing",
            ...(state.filterPriority && { priority: state.filterPriority }),
            ...(state.filterAssignee && { assignee: state.filterAssignee }),
          },
          orderBy: [{ field: "created_at", direction: "desc" }],
        }}
      >
        <Empty><EmptyState title={t.noDoing} icon="coffee"/></Empty>
        <Item>
          <Card>
            <VStack gap={4}>
              <HStack justify="between">
                <Heading level={3}>{item.title}</Heading>
                <Tag label={item.priority} color={item.priority == "high" ? "danger" : "warning"}/>
              </HStack>
              {item.assignee && (
                <HStack gap={6}>
                  <Avatar name={item.assignee} size="sm"/>
                  <Text muted>{item.assignee}</Text>
                </HStack>
              )}
              {item.effort && <Meter value={item.effort} min={0} max={40} label={t.estimate} size="sm" color="primary"/>}
              <HStack justify="end" gap={4}>
                <Tooltip content={t.finishTip}>
                  <Button label={t.finish} size="sm" color="primary" leftIcon="check"
                    onClick={() => data.update({ collection: "cards", id: item.id, patch: { status: "done", completed_at: now } })}/>
                </Tooltip>
                <Menu id="actions" trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                  <MenuItem label={t.moveToBacklog} icon="arrow-left"
                    onClick={() => data.update({ collection: "cards", id: item.id, patch: { status: "backlog" } })}/>
                  <MenuItem separator/>
                  <MenuItem label={t.delete} icon="trash" danger
                    onClick={() => app.confirm({
                      title: t.deletePrompt,
                      color: "danger",
                      onConfirm: () => data.delete({ collection: "cards", id: item.id }),
                    })}/>
                </Menu>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </VStack>

    <VStack gap={6}>
      <HStack justify="between" gap={6}>
        <Heading level={3} content={t.done}/>
        <Badge content="done" color="success"/>
      </HStack>
      <DataList
        collection="cards"
        query={{
          where: {
            status: "done",
            ...(state.filterPriority && { priority: state.filterPriority }),
            ...(state.filterAssignee && { assignee: state.filterAssignee }),
          },
          orderBy: [{ field: "completed_at", direction: "desc" }],
        }}
        paginate={{ pageSize: 10 }}
      >
        <Empty><EmptyState title={t.noDone} icon="trophy"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>✓ {item.title}</Text>
                {item.assignee && <Text muted>{t.by} {item.assignee}</Text>}
                {item.completed_at && <Text muted>{item.completed_at | relative}</Text>}
              </VStack>
              <Menu id="actions" trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label={t.reopen} icon="arrow-counter-clockwise"
                  onClick={() => data.update({ collection: "cards", id: item.id, patch: { status: "doing", completed_at: "" } })}/>
                <MenuItem separator/>
                <MenuItem label={t.delete} icon="trash" danger
                  onClick={() => app.confirm({
                    title: t.deletePrompt,
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "cards", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </VStack>
  </HStack>
</Page>
