<Page title="Profile">
  <Card title={t.cardNew}>
    <DataForm collection="profiles">
      <Input name="name" label={t.labelName} placeholder={t.namePlaceholder}/>
      <Input name="avatar" label={t.labelAvatar} placeholder={t.avatarPlaceholder}/>
      <DatePicker name="birthday" label={t.labelBirthday}/>
      <RadioGroup name="theme" label={t.labelTheme} orientation="horizontal">
        <Radio value="light" label={t.themeLight}/>
        <Radio value="dark" label={t.themeDark}/>
        <Radio value="auto" label={t.themeAuto}/>
      </RadioGroup>
      <Slider name="volume" label={t.labelVolume} min={0} max={100} step={5} showValue/>
      <Textarea name="bio" label={t.labelBio} rows={2} placeholder={t.bioPlaceholder}/>
      <HStack justify="end">
        <Button
          label={t.btnSave}
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
            app.toast({ title: t.savedToast, color: "success" });
          }}
        />
      </HStack>
    </DataForm>
  </Card>

  <Section title={t.sectionSaved}>
    <DataList collection="profiles">
      <Empty><EmptyState title={t.emptyList} icon="user-circle"/></Empty>
      <Item>
        <Card>
          <HStack justify="between" gap={12}>
            <HStack gap={12}>
              <Avatar src={item.avatar} name={item.name} size="lg"/>
              <VStack gap={4}>
                <Heading level={3}>{item.name}</Heading>
                <Text muted>🎂 {item.birthday} · {t.metaTheme} {item.theme}</Text>
                <Meter value={item.volume} min={0} max={100} label={t.labelVolume} size="sm" color="primary"/>
                {item.bio && <Text>{item.bio}</Text>}
              </VStack>
            </HStack>
            <Button
              label={t.btnDelete}
              color="danger"
              leftIcon="trash"
              size="sm"
              onClick={() => app.confirm({
                title: t.confirmDeleteTitle,
                description: t.confirmDeleteDesc,
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
