<Page title="Issues">
  <Card title="新建 Issue">
    <DataForm collection="issues">
      <Input name="title" label="标题" placeholder="简述问题"/>
      <HStack gap={6}>
        <Select name="status" placeholder="状态">
          <Option value="open" label="待处理"/>
          <Option value="in_progress" label="进行中"/>
          <Option value="closed" label="已关闭"/>
        </Select>
        <Select name="priority" placeholder="优先级">
          <Option value="high" label="高"/>
          <Option value="medium" label="中"/>
          <Option value="low" label="低"/>
        </Select>
      </HStack>
      <Input name="tags" label="" placeholder="标签（逗号分隔，可选）"/>
      <HStack justify="end">
        <Button
          label="创建"
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
            app.toast({ title: "Issue 已创建", color: "success" });
          }}
        />
      </HStack>
    </DataForm>
  </Card>

  <Section title="全部 Issues">
    <Table
      collection="issues"
      query={{ orderBy: [{ field: "created_at", direction: "desc" }] }}
      paginate={{ pageSize: 10 }}
    >
      <Empty><EmptyState title="还没有 Issue" icon="folder-open"/></Empty>
      <Column key="title" label="标题"/>
      <Column key="status" label="状态" align="center">
        <Badge content={item.status} color="primary"/>
      </Column>
      <Column key="priority" label="优先级" align="center">
        <Tag label={item.priority} color="warning"/>
      </Column>
      <Column key="tags" label="标签">
        {item.tags && <Text muted>#{item.tags}</Text>}
      </Column>
      <Column key="actions" label="" align="right">
        <Menu trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
          <MenuItem label="设为待处理" icon="circle-dashed"
            disabled={item.status == "open"}
            onClick={() => data.update({ collection: "issues", id: item.id, patch: { status: "open" } })}/>
          <MenuItem label="开始处理" icon="play"
            disabled={item.status == "in_progress"}
            onClick={() => data.update({ collection: "issues", id: item.id, patch: { status: "in_progress" } })}/>
          <MenuItem label="关闭" icon="check"
            disabled={item.status == "closed"}
            onClick={() => data.update({ collection: "issues", id: item.id, patch: { status: "closed" } })}/>
          <MenuItem separator/>
          <MenuItem label="删除" icon="trash" danger
            onClick={() => app.confirm({
              title: "删除该 Issue？",
              color: "danger",
              onConfirm: () => data.delete({ collection: "issues", id: item.id }),
            })}/>
        </Menu>
      </Column>
    </Table>
  </Section>
</Page>
