<Page onEnter={() => scripts.refresh()} className="min-h-screen select-none p-0 pb-24">
  <VStack gap={4} className="px-4 pt-4">
    {/* Hero：最近一个；无数据时 = 友好引导卡 */}
    <DataList collection="events" query={{ orderBy: [{ field: "sort_key", direction: "asc" }], limit: 1 }}>
      <Empty>
        <Card className="mb-0 rounded-3xl border border-dashed border-[var(--ag-border)] bg-transparent shadow-none ring-0 px-6 py-12">
          <VStack gap={4} className="items-center text-center">
            <Icon symbol="confetti" className="text-5xl text-[var(--ag-muted)]"/>
            <VStack gap={1} className="items-center">
              <Heading level={3}>{t.emptyTitle}</Heading>
              <Text muted className="text-sm">{t.emptyHint}</Text>
            </VStack>
            <Button label={t.btnAdd} color="primary" icon="plus"
              onClick={() => setState("/state/_ui/drawers/add", true)}/>
          </VStack>
        </Card>
      </Empty>
      <Item>
        <Card className="mb-0 rounded-3xl border-transparent ring-0 px-6 py-6 text-white shadow-[var(--ag-shadow-lg)] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500">
          <HStack justify="between" className="items-start gap-4">
            <VStack gap={1} className="min-w-0">
              <HStack gap={1} className="items-center opacity-90">
                <Icon className="text-xs"
                  symbol={item.kind == "birthday" ? "cake" : item.kind == "anniversary" ? "heart" : "calendar-dots"}/>
                <Text className="text-[11px] uppercase tracking-widest">{t.next}</Text>
              </HStack>
              <Heading level={2} className="truncate leading-tight mt-1">{item.title}</Heading>
              <Text className="opacity-90 text-sm mt-1">{item.next_at} · {item.milestone}</Text>
            </VStack>
            <VStack gap={0} className="items-end shrink-0">
              <Heading level={1} className="text-6xl font-bold tabular-nums leading-none">{item.days_big}</Heading>
              <Text className="opacity-85 text-[11px] uppercase tracking-widest mt-1">{item.days_word}</Text>
            </VStack>
          </HStack>
        </Card>
      </Item>
    </DataList>

    {/* 其余纪念日 —— offset:1 跳过 hero 占的第一个，彻底去重复 */}
    <DataList collection="events" query={{ orderBy: [{ field: "sort_key", direction: "asc" }], offset: 1 }}>
      <Empty><Spacer/></Empty>
      <Item>
        <Card className="mb-3 rounded-2xl px-4 py-4 border border-white/10 bg-[var(--ag-surface)]/55 backdrop-blur-xl shadow-[var(--ag-shadow)]">
          <HStack justify="between" className="items-center gap-3">
            <HStack gap={3} className="items-center min-w-0">
              <HStack className="h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ag-surface-alt)]/70">
                <Icon className="text-xl"
                  symbol={item.kind == "birthday" ? "cake" : item.kind == "anniversary" ? "heart" : "calendar-dots"}
                  color={item.kind == "birthday" ? "warning" : item.kind == "anniversary" ? "danger" : "info"}/>
              </HStack>
              <VStack gap={1} className="min-w-0">
                <Text className="font-semibold truncate">{item.title}</Text>
                <HStack gap={2} className="items-center flex-wrap">
                  <Text muted className="text-xs">{item.next_at}</Text>
                  {item.milestone && <Badge content={item.milestone} color="secondary"/>}
                  {item.age_label && <Badge content={item.age_label} color="success"/>}
                </HStack>
              </VStack>
            </HStack>
            <HStack gap={2} className="items-center shrink-0">
              <VStack gap={0} className="items-end">
                <Text className="text-2xl font-bold tabular-nums leading-none text-[var(--ag-accent)]">{item.days_big}</Text>
                <Text muted className="text-[10px] uppercase tracking-wide mt-1">{item.days_word}</Text>
              </VStack>
              <Button icon="trash" variant="light" color="danger"
                className="h-9 w-9 shrink-0 rounded-full p-0 text-[var(--ag-muted)] hover:text-[var(--ag-error)]"
                onClick={() => app.confirm({
                  title: t.confirmDelTitle,
                  description: t.confirmDelDesc,
                  confirmLabel: t.btnDelete,
                  color: "danger",
                  onConfirm: () => scripts.removeEvent({ id: item.id }),
                })}/>
            </HStack>
          </HStack>
        </Card>
      </Item>
    </DataList>
  </VStack>

  {/* 悬浮 FAB —— fixed 右下角，点开底部 drawer 录入。z 低于 drawer 遮罩(overlay=100)。 */}
  <Drawer id="add" title={t.addTitle} description={t.addHint} side="bottom"
    trigger={<Button label="+" color="primary"
      className="fixed bottom-6 right-4 z-40 h-14 w-14 rounded-full p-0 text-3xl font-light leading-none shadow-[var(--ag-shadow-lg)]"/>}>
    <DataForm collection="events">
      <Input name="title" placeholder={t.placeholderTitle}/>
      <HStack gap={3}>
        <DatePicker name="date" label={t.labelDate}/>
        <Select name="kind" label={t.labelKind} placeholder={t.labelKind}>
          <Option value="birthday" label={t.optBirthday}/>
          <Option value="anniversary" label={t.optAnniversary}/>
          <Option value="custom" label={t.optCustom}/>
        </Select>
      </HStack>
      <Select name="remind_days" label={t.labelRemind} placeholder={t.optRemindOff}>
        <Option value="-1" label={t.optRemindOff}/>
        <Option value="0" label={t.optRemindDay}/>
        <Option value="1" label={t.optRemind1}/>
        <Option value="3" label={t.optRemind3}/>
        <Option value="7" label={t.optRemind7}/>
      </Select>
      <HStack justify="between" className="items-center pt-1">
        <Switch name="recurring" label={t.switchRecurring}/>
        <Button label={t.btnAdd} color="primary" icon="check" disabled={!form.title || !form.date}
          onClick={() => scripts.addEvent()}/>
      </HStack>
    </DataForm>
  </Drawer>
</Page>
