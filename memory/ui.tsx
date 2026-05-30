<Page title="Memory">
  <Accordion id="memories" defaultOpen={["pinned", "preference"]}>
    <AccordionItem value="pinned" header={t.secPinned} icon="push-pin">
      <DataList
        collection="memories"
        query={{ where: { pinned: true }, orderBy: [{ field: "created_at", direction: "desc" }] }}
      >
        <Empty><EmptyState title={t.emptyPinned} icon="push-pin"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <HStack gap={6}>
                  <Badge content={item.kind} color="primary"/>
                  <Text muted>{item.project} · {item.agent}</Text>
                </HStack>
                <Text>{item.text}</Text>
                {item.tags && <Text muted>#{item.tags}</Text>}
              </VStack>
              <Menu id="actions" trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label={t.menuUnpin} icon="push-pin-slash"
                  onClick={() => data.update({ collection: "memories", id: item.id, patch: { pinned: false } })}/>
                <MenuItem separator/>
                <MenuItem label={t.menuForget} icon="trash" danger
                  onClick={() => app.confirm({
                    title: t.confirmForgetTitle,
                    description: t.confirmForgetDesc,
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </AccordionItem>

    <AccordionItem value="preference" header={t.secPreference} icon="user-circle-gear">
      <DataList
        collection="memories"
        query={{ where: { pinned: false, kind: "preference" }, orderBy: [{ field: "created_at", direction: "desc" }] }}
        paginate={{ pageSize: 10 }}
      >
        <Empty><EmptyState title={t.emptyPreference}/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>{item.project} · {item.agent}</Text>
                <Text>{item.text}</Text>
                {item.tags && <Text muted>#{item.tags}</Text>}
              </VStack>
              <Menu id="actions" trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label={t.menuPin} icon="push-pin"
                  onClick={() => data.update({ collection: "memories", id: item.id, patch: { pinned: true } })}/>
                <MenuItem separator/>
                <MenuItem label={t.menuForget} icon="trash" danger
                  onClick={() => app.confirm({
                    title: t.confirmForgetTitle,
                    description: t.confirmForgetDesc,
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </AccordionItem>

    <AccordionItem value="fact" header={t.secFact} icon="info">
      <DataList
        collection="memories"
        query={{ where: { pinned: false, kind: "fact" }, orderBy: [{ field: "created_at", direction: "desc" }] }}
        paginate={{ pageSize: 10 }}
      >
        <Empty><EmptyState title={t.emptyFact}/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>{item.project} · {item.agent}</Text>
                <Text>{item.text}</Text>
                {item.tags && <Text muted>#{item.tags}</Text>}
              </VStack>
              <Menu id="actions" trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label={t.menuPin} icon="push-pin"
                  onClick={() => data.update({ collection: "memories", id: item.id, patch: { pinned: true } })}/>
                <MenuItem separator/>
                <MenuItem label={t.menuForget} icon="trash" danger
                  onClick={() => app.confirm({
                    title: t.confirmForgetTitle,
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </AccordionItem>

    <AccordionItem value="decision" header={t.secDecision} icon="check-circle">
      <DataList
        collection="memories"
        query={{ where: { pinned: false, kind: "decision" }, orderBy: [{ field: "created_at", direction: "desc" }] }}
        paginate={{ pageSize: 10 }}
      >
        <Empty><EmptyState title={t.emptyDecision}/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>{item.project} · {item.agent}</Text>
                <Text>{item.text}</Text>
                {item.tags && <Text muted>#{item.tags}</Text>}
              </VStack>
              <Menu id="actions" trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label={t.menuPin} icon="push-pin"
                  onClick={() => data.update({ collection: "memories", id: item.id, patch: { pinned: true } })}/>
                <MenuItem separator/>
                <MenuItem label={t.menuForget} icon="trash" danger
                  onClick={() => app.confirm({
                    title: t.confirmForgetTitle,
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </AccordionItem>

    <AccordionItem value="note" header={t.secNote} icon="note">
      <DataList
        collection="memories"
        query={{ where: { pinned: false, kind: "note" }, orderBy: [{ field: "created_at", direction: "desc" }] }}
        paginate={{ pageSize: 10 }}
      >
        <Empty><EmptyState title={t.emptyNote}/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>{item.project} · {item.agent}</Text>
                <Text>{item.text}</Text>
                {item.tags && <Text muted>#{item.tags}</Text>}
              </VStack>
              <Menu id="actions" trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label={t.menuPin} icon="push-pin"
                  onClick={() => data.update({ collection: "memories", id: item.id, patch: { pinned: true } })}/>
                <MenuItem separator/>
                <MenuItem label={t.menuForget} icon="trash" danger
                  onClick={() => app.confirm({
                    title: t.confirmForgetTitle,
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </AccordionItem>
  </Accordion>
</Page>
