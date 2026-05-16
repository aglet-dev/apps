<Page title="Profile">
  <Card title="新建资料">
    <DataForm collection="profiles">
      <Input name="name" label="姓名" placeholder="Ada Lovelace"/>
      <Input name="avatar" label="头像 URL" placeholder="https://…"/>
      <DatePicker name="birthday" label="生日"/>
      <RadioGroup name="theme" label="主题" orientation="horizontal">
        <Radio value="light" label="浅色"/>
        <Radio value="dark" label="深色"/>
        <Radio value="auto" label="跟随系统"/>
      </RadioGroup>
      <Slider name="volume" label="音量" min={0} max={100} step={5} showValue/>
      <Textarea name="bio" label="自我介绍" rows={2} placeholder="可选"/>
      <HStack justify="end">
        <Button
          label="保存"
          color="primary"
          leftIcon="floppy-disk"
          disabled={!form.name}
          onClick={() => {
            data.create({
              collection: "profiles",
              data: {
                name: form.name,
                avatar: form.avatar,
                birthday: form.birthday,
                theme: form.theme,
                volume: form.volume,
                bio: form.bio,
              },
            });
            app.toast({ title: "已保存", color: "success" });
          }}
        />
      </HStack>
    </DataForm>
  </Card>

  <Section title="已保存">
    <DataList collection="profiles">
      <Empty><EmptyState title="还没有资料" icon="user-circle"/></Empty>
      <Item>
        <Card>
          <HStack justify="between" gap={12}>
            <HStack gap={12}>
              <Avatar src={item.avatar} name={item.name} size="lg"/>
              <VStack gap={4}>
                <Heading level={3}>{item.name}</Heading>
                <Text muted>🎂 {item.birthday} · 主题 {item.theme}</Text>
                <Meter value={item.volume} min={0} max={100} label="音量" size="sm" color="primary"/>
                {item.bio && <Text>{item.bio}</Text>}
              </VStack>
            </HStack>
            <Button
              label="删除"
              color="danger"
              leftIcon="trash"
              onClick={() => app.confirm({
                title: "删除该资料？",
                description: "无法恢复。",
                color: "danger",
                onConfirm: () => data.delete({ collection: "profiles", id: item.id }),
              })}
            />
          </HStack>
        </Card>
      </Item>
    </DataList>
  </Section>
</Page>
