<Page>
  {state.action_error && (
    <Text className="text-xs text-red-500 px-4 pt-2">⚠ {{ op: "state", path: "/state/action_error" }}</Text>
  )}
  {state.sync_error && (
    <Text className="text-xs text-amber-500 px-4 pt-2">{{ op: "state", path: "/state/sync_error" }}</Text>
  )}

  <Tabs id="main" defaultValue="repos" position="bottom">
    <Tab value="repos" label={t.tabRepos} icon="folders">

      {/* 仓库列表(浏览态)*/}
      {state.browsing && (
        <DataList
          collection="repos"
          query={{ orderBy: [{ field: "last_run_at", direction: "desc" }], limit: 200 }}
        >
          <Empty><EmptyState title={t.emptyReposTitle} description={t.emptyReposDesc} icon="folders"/></Empty>
          <Item>
            <Card>
              <VStack gap={6}>
                <HStack gap={6} justify="between" className="items-center">
                  <Heading level={3}>{item.last_status} {item.name_short}</Heading>
                  <Text muted className="text-xs">{item.wf_count} ⚙</Text>
                </HStack>
                <HStack gap={6} justify="between" className="items-center">
                  <HStack gap={1} className="items-center">
                    <Text muted className="text-xs">{item.owner} ·</Text>
                    <Text muted className="text-xs">{item.last_run_at | relative}</Text>
                  </HStack>
                  <Button label={t.btnOpen} icon="caret-right" variant="light"
                    onClick={() => scripts.openRepo({ repo: item.repo })}/>
                </HStack>
              </VStack>
            </Card>
          </Item>
        </DataList>
      )}

      {/* 仓库详情(选中仓时):workflows 运行选项 + 该仓 runs */}
      {state.repo && (
        <VStack gap={10}>
          <HStack gap={4} className="items-center">
            <Button label={t.btnBack} icon="arrow-left" variant="light"
              onClick={() => scripts.backToList()}/>
            <Heading level={3}>{{ op: "state", path: "/state/repo" }}</Heading>
          </HStack>

          <Heading level={4}>{t.secWorkflows}</Heading>
          <DataList
            collection="workflows"
            query={{ where: { repo: state.repo }, orderBy: [{ field: "name", direction: "asc" }], limit: 100 }}
          >
            <Empty><EmptyState title={t.emptyWfTitle} icon="list-checks"/></Empty>
            <Item>
              <Card>
                <HStack gap={6} justify="between" className="items-center">
                  <VStack gap={2}>
                    <Text>{item.name}</Text>
                    <Text muted className="text-xs">{item.path} · {item.default_branch}</Text>
                  </VStack>
                  <HStack gap={6} className="items-center">
                    <Button label={t.btnRun} icon="play" color="primary" variant="light"
                      onClick={() => scripts.runWorkflow({ repo: item.repo, wf_id: item.wf_id, ref: item.default_branch })}/>
                    <Link label={t.btnView} icon="arrow-square-out" href={item.html_url}/>
                  </HStack>
                </HStack>
              </Card>
            </Item>
          </DataList>

          <Heading level={4}>{t.secRuns}</Heading>
          <DataList
            collection="runs"
            query={{ where: { repo: state.repo }, orderBy: [{ field: "updated_at", direction: "desc" }], limit: 30 }}
          >
            <Empty><EmptyState title={t.emptyRunsTitle} icon="play-circle"/></Empty>
            <Item>
              <Card>
                <VStack gap={6}>
                  <Heading level={3}>{item.state_emoji} {item.workflow_name}</Heading>
                  <HStack gap={1} className="items-center">
                <Text muted className="text-xs">{item.branch} · {item.event} · {item.actor} ·</Text>
                <Text muted className="text-xs">{item.updated_at | relative}</Text>
              </HStack>
                  <HStack justify="end" gap={8} className="items-center">
                    {item.can_rerun && (
                      <Button label={t.btnRerun} icon="arrow-clockwise" variant="light"
                        onClick={() => scripts.rerunRun({ repo: item.repo, run_id: item.run_id })}/>
                    )}
                    {item.can_cancel && (
                      <Button label={t.btnCancel} icon="x-circle" variant="light" color="danger"
                        onClick={() => scripts.cancelRun({ repo: item.repo, run_id: item.run_id })}/>
                    )}
                    <Link label={t.btnOpenGithub} icon="arrow-square-out" href={item.html_url}/>
                  </HStack>
                </VStack>
              </Card>
            </Item>
          </DataList>
        </VStack>
      )}
    </Tab>

    {/* 全局最近运行(我管理的仓)*/}
    <Tab value="runs" label={t.tabRuns} icon="play-circle">
      <DataList
        collection="runs"
        query={{ orderBy: [{ field: "updated_at", direction: "desc" }], limit: 100 }}
      >
        <Empty><EmptyState title={t.emptyRunsTitle} description={t.emptyRunsDesc} icon="play-circle"/></Empty>
        <Item>
          <Card>
            <VStack gap={6}>
              <HStack gap={6} justify="between" className="items-center">
                <Text muted>{item.repo}</Text>
                <Text muted>#{item.run_number}</Text>
              </HStack>
              <Heading level={3}>{item.state_emoji} {item.workflow_name}</Heading>
              <HStack gap={1} className="items-center">
                <Text muted className="text-xs">{item.branch} · {item.event} · {item.actor} ·</Text>
                <Text muted className="text-xs">{item.updated_at | relative}</Text>
              </HStack>
              <HStack justify="end" gap={8} className="items-center">
                {item.can_rerun && (
                  <Button label={t.btnRerun} icon="arrow-clockwise" variant="light"
                    onClick={() => scripts.rerunRun({ repo: item.repo, run_id: item.run_id })}/>
                )}
                {item.can_cancel && (
                  <Button label={t.btnCancel} icon="x-circle" variant="light" color="danger"
                    onClick={() => scripts.cancelRun({ repo: item.repo, run_id: item.run_id })}/>
                )}
                <Link label={t.btnOpenGithub} icon="arrow-square-out" href={item.html_url}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>
  </Tabs>
</Page>
