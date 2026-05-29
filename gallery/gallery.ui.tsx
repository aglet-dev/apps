<Page className="min-h-screen overflow-y-auto bg-[var(--ag-bg)] text-[var(--ag-fg)]">
  <VStack gap={5} className="mx-auto max-w-3xl px-6 py-7">

    {/* ── Header ─────────────────────────────────────────────── */}
    <VStack gap={1}>
      <HStack gap={2} align="center">
        <Icon symbol="swatches" color="primary" size="lg"/>
        <Heading content="Aglet Components" level={1}/>
      </HStack>
      <Text content="每个组件 × 状态/变体的可视化验收台。改样式 / 调主题后，对着它截图做回归。" muted size="sm"/>
    </VStack>

    {/* ── Design Tokens ──────────────────────────────────────── */}
    <Card title="Design Tokens" description="theme.css 单一真理源 · 前缀 --ag- · 跟随系统 light/dark">
      <VStack gap={3}>
        <Text content="语义色" muted size="sm"/>
        <HStack gap={3} className="flex-wrap">
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-primary)]"/><Text content="primary" size="sm"/></VStack>
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-secondary)]"/><Text content="secondary" size="sm"/></VStack>
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-success)]"/><Text content="success" size="sm"/></VStack>
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-warning)]"/><Text content="warning" size="sm"/></VStack>
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-danger)]"/><Text content="danger" size="sm"/></VStack>
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-info)]"/><Text content="info" size="sm"/></VStack>
        </HStack>
        <Text content="结构色" muted size="sm"/>
        <HStack gap={3} className="flex-wrap">
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-bg)]"/><Text content="bg" size="sm"/></VStack>
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-surface)]"/><Text content="surface" size="sm"/></VStack>
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-surface-alt)]"/><Text content="surface-alt" size="sm"/></VStack>
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-border)]"/><Text content="border" size="sm"/></VStack>
          <VStack gap={1} align="center"><HStack className="h-12 w-20 rounded-md border border-[var(--ag-border)] bg-[var(--ag-muted)]"/><Text content="muted" size="sm"/></VStack>
        </HStack>
        <Text content="圆角 · 阴影" muted size="sm"/>
        <HStack gap={3} className="flex-wrap" align="center">
          <HStack className="h-12 w-16 items-center justify-center rounded-[var(--ag-radius-sm)] bg-[var(--ag-surface-alt)]"><Text content="sm" size="sm" muted/></HStack>
          <HStack className="h-12 w-16 items-center justify-center rounded-[var(--ag-radius)] bg-[var(--ag-surface-alt)]"><Text content="md" size="sm" muted/></HStack>
          <HStack className="h-12 w-16 items-center justify-center rounded-[var(--ag-radius-lg)] bg-[var(--ag-surface-alt)]"><Text content="lg" size="sm" muted/></HStack>
          <HStack className="h-12 w-20 items-center justify-center rounded-md bg-[var(--ag-surface)] shadow-[var(--ag-shadow-sm)]"><Text content="shadow" size="sm" muted/></HStack>
          <HStack className="h-12 w-20 items-center justify-center rounded-md bg-[var(--ag-surface)] shadow-[var(--ag-shadow)]"><Text content="shadow" size="sm" muted/></HStack>
          <HStack className="h-12 w-20 items-center justify-center rounded-md bg-[var(--ag-surface)] shadow-[var(--ag-shadow-lg)]"><Text content="shadow-lg" size="sm" muted/></HStack>
        </HStack>
      </VStack>
    </Card>

    {/* ── Typography ─────────────────────────────────────────── */}
    <Card title="Typography">
      <VStack gap={2}>
        <Heading content="Heading level 1" level={1}/>
        <Heading content="Heading level 2" level={2}/>
        <Heading content="Heading level 3" level={3}/>
        <Heading content="Heading level 4" level={4}/>
        <Divider/>
        <Text content="Body text — default。" />
        <Text content="Body text — muted（次要说明）。" muted/>
        <HStack gap={3} className="flex-wrap">
          <Text content="primary" color="primary"/>
          <Text content="success" color="success"/>
          <Text content="warning" color="warning"/>
          <Text content="danger" color="danger"/>
        </HStack>
        <HStack gap={3} align="baseline" className="flex-wrap">
          <Text content="size sm" size="sm"/>
          <Text content="size md" size="md"/>
          <Text content="size lg" size="lg"/>
        </HStack>
        <Divider/>
        <Markdown source="**Markdown** 支持 `inline code`、[链接](https://aglet.dev) 与 *斜体*。"/>
        <Link label="这是一个 Link" href="https://aglet.dev" icon="arrow-square-out"/>
      </VStack>
    </Card>

    {/* ── Buttons ────────────────────────────────────────────── */}
    <Card title="Buttons" description="variant × color × states">
      <VStack gap={3}>
        <Text content="color（variant=solid）" muted size="sm"/>
        <HStack gap={2} className="flex-wrap">
          <Button label="Default"/>
          <Button label="Primary" color="primary"/>
          <Button label="Secondary" color="secondary"/>
          <Button label="Success" color="success"/>
          <Button label="Warning" color="warning"/>
          <Button label="Danger" color="danger"/>
        </HStack>
        <Text content="variant（color=primary）" muted size="sm"/>
        <HStack gap={2} className="flex-wrap">
          <Button label="solid" color="primary" variant="solid"/>
          <Button label="bordered" color="primary" variant="bordered"/>
          <Button label="flat" color="primary" variant="flat"/>
          <Button label="ghost" color="primary" variant="ghost"/>
          <Button label="light" color="primary" variant="light"/>
        </HStack>
        <Text content="variant × danger" muted size="sm"/>
        <HStack gap={2} className="flex-wrap">
          <Button label="solid" color="danger" variant="solid"/>
          <Button label="bordered" color="danger" variant="bordered"/>
          <Button label="flat" color="danger" variant="flat"/>
          <Button label="ghost" color="danger" variant="ghost"/>
          <Button label="light" color="danger" variant="light"/>
        </HStack>
        <Text content="states / icons / sizes" muted size="sm"/>
        <HStack gap={2} className="flex-wrap" align="center">
          <Button label="Loading" color="primary" loading/>
          <Button label="Disabled" disabled/>
          <Button label="Pressed" pressed/>
          <Button label="Left icon" leftIcon="plus" color="primary" variant="flat"/>
          <Button label="Right icon" rightIcon="caret-down" variant="bordered"/>
          <Button icon="trash" color="danger" variant="light"/>
        </HStack>
        <HStack gap={2} className="flex-wrap" align="center">
          <Button label="sm" size="sm" color="primary"/>
          <Button label="md" size="md" color="primary"/>
          <Button label="lg" size="lg" color="primary"/>
        </HStack>
      </VStack>
    </Card>

    {/* ── Badges & Tags ──────────────────────────────────────── */}
    <Card title="Badges & Tags">
      <VStack gap={3}>
        <HStack gap={2} className="flex-wrap" align="center">
          <Badge content="default"/>
          <Badge content="primary" color="primary"/>
          <Badge content="success" color="success"/>
          <Badge content="warning" color="warning"/>
          <Badge content="danger" color="danger"/>
          <Badge content="9" color="danger" dot/>
          <Badge content="new" color="primary" icon="sparkle"/>
        </HStack>
        <HStack gap={2} className="flex-wrap" align="center">
          <Tag label="plain"/>
          <Tag label="primary" color="primary"/>
          <Tag label="success" color="success" icon="check"/>
          <Tag label="removable" color="warning" removable/>
        </HStack>
      </VStack>
    </Card>

    {/* ── Feedback ───────────────────────────────────────────── */}
    <Card title="Feedback">
      <VStack gap={3}>
        <Alert title="Info" description="默认信息提示。" />
        <Alert title="Success" description="操作成功。" color="success"/>
        <Alert title="Warning" description="注意潜在问题。" color="warning"/>
        <Alert title="Danger" description="出错了，需要处理。" color="danger" dismissable/>
        <Divider/>
        <VStack gap={2}>
          <Progress value={30} label="Progress 30%"/>
          <Progress value={70} color="success" label="Progress 70%"/>
          <Progress value={95} color="danger" label="Progress 95%"/>
          <Progress indeterminate label="Indeterminate"/>
        </VStack>
        <Divider/>
        <Meter value={62} min={0} max={100} label="Meter 62/100"/>
        <Divider/>
        <Text content="Skeleton" muted size="sm"/>
        <Skeleton lines={3}/>
        <HStack gap={3} align="center">
          <Skeleton shape="circle" size="lg"/>
          <Skeleton shape="rect" width={160} height={40}/>
        </HStack>
        <Divider/>
        <EmptyState title="Nothing here yet" description="EmptyState — 空数据占位。" icon="tray"/>
      </VStack>
    </Card>

    {/* ── Avatars & Icons ────────────────────────────────────── */}
    <Card title="Avatars & Icons">
      <VStack gap={3}>
        <HStack gap={2} className="flex-wrap" align="center">
          <Avatar name="Guofeng Lin"/>
          <Avatar name="Ada L" color="primary"/>
          <Avatar name="Sq" shape="square" color="success"/>
          <Avatar name="S" size="sm"/>
          <Avatar name="M" size="md"/>
          <Avatar name="L" size="lg"/>
        </HStack>
        <Divider/>
        <HStack gap={3} className="flex-wrap" align="center">
          <Icon symbol="house"/>
          <Icon symbol="gear"/>
          <Icon symbol="user"/>
          <Icon symbol="bell" color="primary"/>
          <Icon symbol="heart" color="danger"/>
          <Icon symbol="star" color="warning"/>
          <Icon symbol="check-circle" color="success"/>
          <Icon symbol="magnifying-glass"/>
          <Icon symbol="trash"/>
          <Icon symbol="cloud" size="lg"/>
        </HStack>
      </VStack>
    </Card>

    {/* ── Inputs（DataForm 提供 form scope）─────────────────── */}
    <Card title="Inputs" description="包在 DataForm 里，有真实表单状态">
      <DataForm collection="demo">
        <VStack gap={3}>
          <Input name="name" label="Text input" placeholder="你的名字"/>
          <Input name="email_err" label="With error" placeholder="invalid" error="格式不对"/>
          <Input name="amount" label="With affixes" placeholder="0.00" prefix="$" suffix="USD"/>
          <Textarea name="bio" label="Textarea" placeholder="多行文本…" rows={3}/>
          <NumberField name="qty" label="NumberField" min={0} max={10} step={1}/>
          <Select name="fruit" label="Select" placeholder="选一个">
            <Option value="apple" label="Apple"/>
            <Option value="banana" label="Banana"/>
            <Option value="cherry" label="Cherry"/>
          </Select>
          <Combobox name="city" label="Combobox" placeholder="搜索城市">
            <Option value="tokyo" label="Tokyo"/>
            <Option value="osaka" label="Osaka"/>
            <Option value="kyoto" label="Kyoto"/>
          </Combobox>
          <HStack gap={4} className="flex-wrap">
            <Switch name="notify" label="Switch"/>
            <Checkbox name="agree" label="Checkbox"/>
          </HStack>
          <RadioGroup name="plan" label="RadioGroup">
            <Radio value="free" label="Free"/>
            <Radio value="pro" label="Pro"/>
            <Radio value="team" label="Team"/>
          </RadioGroup>
          <Slider name="volume" label="Slider" min={0} max={100} step={5} showValue/>
          <DatePicker name="due" label="DatePicker"/>
        </VStack>
      </DataForm>
    </Card>

    {/* ── Layout ─────────────────────────────────────────────── */}
    <Card title="Layout">
      <VStack gap={3}>
        <Text content="HStack / justify" muted size="sm"/>
        <HStack gap={2} justify="between" className="rounded-md bg-[var(--ag-surface-alt)] p-2">
          <Badge content="left"/>
          <Badge content="center"/>
          <Badge content="right"/>
        </HStack>
        <Text content="Tabs" muted size="sm"/>
        <Tabs id="demo-tabs" defaultValue="one">
          <Tab value="one" label="First" icon="number-one">
            <Text content="第一个 tab 的内容。"/>
          </Tab>
          <Tab value="two" label="Second" icon="number-two">
            <Text content="第二个 tab 的内容。"/>
          </Tab>
          <Tab value="three" label="Third" icon="number-three">
            <Text content="第三个 tab 的内容。"/>
          </Tab>
        </Tabs>
        <Text content="Accordion" muted size="sm"/>
        <Accordion id="demo-acc">
          <AccordionItem header="基础设置" icon="sliders">
            <Text content="折叠面板内容一。"/>
          </AccordionItem>
          <AccordionItem header="高级设置" icon="gear">
            <Text content="折叠面板内容二。"/>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Card>

    {/* ── Overlays ───────────────────────────────────────────── */}
    <Card title="Overlays" description="点击触发">
      <HStack gap={2} className="flex-wrap" align="center">
        <Modal trigger={<Button label="Open Modal" color="primary"/>} title="Modal 标题" description="这是一个对话框。" confirmLabel="确定" cancelLabel="取消">
          <Text content="Modal 主体内容。"/>
        </Modal>
        <Drawer id="demo-drawer" trigger={<Button label="Open Drawer"/>} title="Drawer 面板" side="right">
          <Text content="从右侧滑出的抽屉内容。"/>
        </Drawer>
        <Menu id="demo-menu" trigger={<Button label="Menu" rightIcon="caret-down"/>}>
          <MenuItem label="编辑" icon="pencil-simple"/>
          <MenuItem label="复制" icon="copy"/>
          <MenuItem separator/>
          <MenuItem label="删除" icon="trash" danger/>
        </Menu>
        <Tooltip content="这是一个 tooltip">
          <Button label="Hover me" leftIcon="info"/>
        </Tooltip>
      </HStack>
    </Card>

  </VStack>
</Page>
