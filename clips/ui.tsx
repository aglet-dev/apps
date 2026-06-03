<Tray id="main">
  {/* 菜单栏图标 */}
  <TrayLabel>
    <Icon symbol="clipboard-text"/>
  </TrayLabel>

  {/* 点开弹出：搜索框 + 历史列表（置顶在前，按时间倒序）。 */}
  <TrayPopover>
    <VStack gap={8} className="px-3 py-3">
      <Input name="search" bind="/state/search" placeholder={t.searchPlaceholder}/>

      <DataList
        collection="clips"
        query={{
          where: { ...(state.search && { text: { $contains: state.search } }) },
          orderBy: [
            { field: "pinned", direction: "desc" },
            { field: "ts", direction: "desc" }
          ],
          limit: 50
        }}
      >
        <Empty>
          <EmptyState title={t.emptyTitle} description={t.emptyDesc} icon="clipboard"/>
        </Empty>
        <Item>
          <HStack className="items-center gap-1">
            {/* 点文本 = 重新复制回剪贴板 */}
            <Button
              variant="light"
              size="sm"
              className="flex-1 justify-start truncate text-left"
              label={item.text}
              onClick={() => scripts.copy({ id: item.id })}
            />
            {/* 置顶切换 */}
            <Button
              variant="light"
              size="sm"
              leftIcon={item.pinned ? "push-pin-fill" : "push-pin"}
              onClick={() => scripts.togglePin({ id: item.id })}
            />
            {/* 删除 */}
            <Button
              variant="light"
              size="sm"
              leftIcon="trash"
              onClick={() => data.delete({ collection: "clips", id: item.id })}
            />
          </HStack>
        </Item>
      </DataList>
    </VStack>
  </TrayPopover>
</Tray>
