<Page title="Kanban">
  <HStack justify="between" gap={6}>
    <Text muted>看板：拖卡片在不同状态间，用 Menu 调整或删除；筛选用 Drawer。</Text>
    <Drawer
      title="筛选"
      description="按负责人 / 优先级"
      side="right"
      trigger={<Button label="筛选" leftIcon="funnel"/>}
    >
      <Heading level={3} content="负责人"/>
      <HStack gap={4}>
        <Button label="全部" size="sm" pressed={!state.filterAssignee}
          onClick={() => setState("/state/filterAssignee", "")}/>
        <Button label="Ada" size="sm" pressed={state.filterAssignee == "Ada"}
          onClick={() => setState("/state/filterAssignee", "Ada")}/>
        <Button label="Linus" size="sm" pressed={state.filterAssignee == "Linus"}
          onClick={() => setState("/state/filterAssignee", "Linus")}/>
      </HStack>
      <Heading level={3} content="优先级"/>
      <HStack gap={4}>
        <Button label="全部" size="sm" pressed={!state.filterPriority}
          onClick={() => setState("/state/filterPriority", "")}/>
        <Button label="高" size="sm" pressed={state.filterPriority == "high"}
          onClick={() => setState("/state/filterPriority", "high")}/>
        <Button label="中" size="sm" pressed={state.filterPriority == "medium"}
          onClick={() => setState("/state/filterPriority", "medium")}/>
        <Button label="低" size="sm" pressed={state.filterPriority == "low"}
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

  <Accordion defaultOpen={["new"]}>
    <AccordionItem value="new" header="➕ 新建卡片" icon="plus-circle">
      <DataForm collection="cards">
        <Input name="title" label="" placeholder="任务标题"/>
        <HStack gap={6}>
          <Select name="priority" placeholder="优先级">
            <Option value="high" label="高"/>
            <Option value="medium" label="中"/>
            <Option value="low" label="低"/>
          </Select>
          <Combobox name="assignee" placeholder="负责人">
            <Option value="Ada" label="Ada Lovelace"/>
            <Option value="Linus" label="Linus Torvalds"/>
            <Option value="Grace" label="Grace Hopper"/>
          </Combobox>
          <NumberField name="effort" label="" placeholder="估时 (h)" min={0} max={40} step={0.5}/>
        </HStack>
        <Textarea name="notes" label="" placeholder="备注（可选）" rows={2} autoResize/>
        <HStack justify="end">
          <Button
            label="创建"
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
              app.toast({ title: "已加入待办", color: "success" });
            }}
          />
        </HStack>
      </DataForm>
    </AccordionItem>
  </Accordion>

  <HStack gap={6} align="start">
    <VStack gap={6}>
      <HStack justify="between" gap={6}>
        <Heading level={3} content="待办"/>
        <Badge content="backlog" color="default"/>
      </HStack>
      <DataList
        collection="cards"
        query={{
          where: { status: "backlog", priority: state.filterPriority, assignee: state.filterAssignee },
          orderBy: [{ field: "created_at", direction: "desc" }],
        }}
      >
        <Empty><EmptyState title="无待办" icon="check-circle"/></Empty>
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
              {item.effort && <Meter value={item.effort} min={0} max={40} label="估时 (h)" size="sm" color="primary"/>}
              <HStack justify="end" gap={4}>
                <Tooltip content="开始处理 (移至进行中)">
                  <Button label="开始" size="sm" leftIcon="play"
                    onClick={() => data.update({ collection: "cards", id: item.id, patch: { status: "doing" } })}/>
                </Tooltip>
                <Menu trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                  <MenuItem label="提至完成" icon="check"
                    onClick={() => data.update({ collection: "cards", id: item.id, patch: { status: "done", completed_at: now } })}/>
                  <MenuItem separator/>
                  <MenuItem label="删除" icon="trash" danger
                    onClick={() => app.confirm({
                      title: "删除该卡片？",
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
        <Heading level={3} content="进行中"/>
        <Badge content="doing" color="warning"/>
      </HStack>
      <DataList
        collection="cards"
        query={{
          where: { status: "doing", priority: state.filterPriority, assignee: state.filterAssignee },
          orderBy: [{ field: "created_at", direction: "desc" }],
        }}
      >
        <Empty><EmptyState title="无进行" icon="coffee"/></Empty>
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
              {item.effort && <Meter value={item.effort} min={0} max={40} label="估时 (h)" size="sm" color="primary"/>}
              <HStack justify="end" gap={4}>
                <Tooltip content="完成">
                  <Button label="完成" size="sm" color="primary" leftIcon="check"
                    onClick={() => data.update({ collection: "cards", id: item.id, patch: { status: "done", completed_at: now } })}/>
                </Tooltip>
                <Menu trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                  <MenuItem label="退回待办" icon="arrow-left"
                    onClick={() => data.update({ collection: "cards", id: item.id, patch: { status: "backlog" } })}/>
                  <MenuItem separator/>
                  <MenuItem label="删除" icon="trash" danger
                    onClick={() => app.confirm({
                      title: "删除该卡片？",
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
        <Heading level={3} content="完成"/>
        <Badge content="done" color="success"/>
      </HStack>
      <DataList
        collection="cards"
        query={{
          where: { status: "done", priority: state.filterPriority, assignee: state.filterAssignee },
          orderBy: [{ field: "completed_at", direction: "desc" }],
        }}
        paginate={{ pageSize: 10 }}
      >
        <Empty><EmptyState title="还未完成任何卡片" icon="trophy"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>✓ {item.title}</Text>
                {item.assignee && <Text muted>by {item.assignee}</Text>}
                {item.completed_at && <Text muted>{item.completed_at | relative}</Text>}
              </VStack>
              <Menu trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label="重新打开" icon="arrow-counter-clockwise"
                  onClick={() => data.update({ collection: "cards", id: item.id, patch: { status: "doing", completed_at: "" } })}/>
                <MenuItem separator/>
                <MenuItem label="删除" icon="trash" danger
                  onClick={() => app.confirm({
                    title: "删除该卡片？",
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
