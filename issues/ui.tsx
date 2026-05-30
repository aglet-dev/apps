<Page title="Issues">
  <Card title={t.cardNew}>
    <DataForm collection="issues">
      <Input name="title" label={t.labelTitle} placeholder={t.titlePlaceholder}/>
      <HStack gap={6}>
        <Select name="status" label={t.labelStatus} placeholder={t.statusPlaceholder}>
          <Option value="open" label={t.statusOpen}/>
          <Option value="in_progress" label={t.statusInProgress}/>
          <Option value="closed" label={t.statusClosed}/>
        </Select>
        <Select name="priority" label={t.labelPriority} placeholder={t.priorityPlaceholder}>
          <Option value="high" label={t.priorityHigh}/>
          <Option value="medium" label={t.priorityMedium}/>
          <Option value="low" label={t.priorityLow}/>
        </Select>
      </HStack>
      <Input name="tags" label={t.labelTags} placeholder={t.tagsPlaceholder}/>
      <HStack justify="end">
        <Button
          label={t.btnCreate}
          color="primary"
          leftIcon="plus"
          disabled={!form.title}
          onClick={() => {
            data.create({
              collection: "issues",
              data: {
                title: form.title,
                status: form.status,
                priority: form.priority,
                tags: form.tags,
                created_at: now,
              },
            });
            app.toast({ title: t.createdToast, color: "success" });
          }}
        />
      </HStack>
    </DataForm>
  </Card>

  <Section title={t.sectionAll}>
    <HStack gap={6} justify="end">
      <Drawer id="filters"
        title={t.btnFilter}
        description={t.filterDesc}
        side="right"
        trigger={<Button label={t.btnFilter} leftIcon="funnel"/>}
      >
        <Heading level={3} content={t.labelStatus}/>
        <HStack gap={4}>
          <Button value="status_all" label={t.filterAll} size="sm" pressed={!state.filterStatus}
            onClick={() => setState("/state/filterStatus", "")}/>
          <Button value="status_open" label={t.statusOpen} size="sm" pressed={state.filterStatus == "open"}
            onClick={() => setState("/state/filterStatus", "open")}/>
          <Button value="status_in_progress" label={t.statusInProgress} size="sm" pressed={state.filterStatus == "in_progress"}
            onClick={() => setState("/state/filterStatus", "in_progress")}/>
          <Button value="status_closed" label={t.statusClosed} size="sm" pressed={state.filterStatus == "closed"}
            onClick={() => setState("/state/filterStatus", "closed")}/>
        </HStack>
        <Heading level={3} content={t.labelPriority}/>
        <HStack gap={4}>
          <Button value="priority_all" label={t.filterAll} size="sm" pressed={!state.filterPriority}
            onClick={() => setState("/state/filterPriority", "")}/>
          <Button value="priority_high" label={t.priorityHigh} size="sm" pressed={state.filterPriority == "high"}
            onClick={() => setState("/state/filterPriority", "high")}/>
          <Button value="priority_medium" label={t.priorityMedium} size="sm" pressed={state.filterPriority == "medium"}
            onClick={() => setState("/state/filterPriority", "medium")}/>
          <Button value="priority_low" label={t.priorityLow} size="sm" pressed={state.filterPriority == "low"}
            onClick={() => setState("/state/filterPriority", "low")}/>
        </HStack>
      </Drawer>
    </HStack>
    <HStack gap={4}>
      {state.filterStatus && (
        <Tag label={state.filterStatus} color="primary" icon="funnel" removable
          onRemove={() => setState("/state/filterStatus", "")}/>
      )}
      {state.filterPriority && (
        <Tag label={state.filterPriority} color="warning" icon="funnel" removable
          onRemove={() => setState("/state/filterPriority", "")}/>
      )}
    </HStack>
    <Table
      collection="issues"
      query={{
        where: {
          status: state.filterStatus,
          priority: state.filterPriority,
        },
        orderBy: [{ field: "created_at", direction: "desc" }],
      }}
      paginate={{ pageSize: 10 }}
    >
      <Empty><EmptyState title={t.emptyList} icon="folder-open"/></Empty>
      <Column key="title" label={t.colTitle}/>
      <Column key="status" label={t.colStatus} align="center">
        <Badge content={item.status} color="primary"/>
      </Column>
      <Column key="priority" label={t.colPriority} align="center">
        <Tag label={item.priority} color="warning"/>
      </Column>
      <Column key="tags" label={t.colTags}>
        {item.tags && <Text muted>#{item.tags}</Text>}
      </Column>
      <Column key="actions" label="" align="right">
        <Menu id="actions" trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
          <MenuItem value="set_open" label={t.menuSetOpen} icon="circle-dashed"
            disabled={item.status == "open"}
            onClick={() => data.update({ collection: "issues", id: item.id, patch: { status: "open" } })}/>
          <MenuItem value="start" label={t.menuStart} icon="play"
            disabled={item.status == "in_progress"}
            onClick={() => data.update({ collection: "issues", id: item.id, patch: { status: "in_progress" } })}/>
          <MenuItem value="close" label={t.menuClose} icon="check"
            disabled={item.status == "closed"}
            onClick={() => data.update({ collection: "issues", id: item.id, patch: { status: "closed" } })}/>
          <MenuItem separator/>
          <MenuItem value="delete" label={t.menuDelete} icon="trash" danger
            onClick={() => app.confirm({
              title: t.confirmDeleteTitle,
              color: "danger",
              onConfirm: () => data.delete({ collection: "issues", id: item.id }),
            })}/>
        </Menu>
      </Column>
    </Table>
  </Section>
</Page>
