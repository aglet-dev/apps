<Page>
  <VStack gap={6} className="px-3 py-3 select-none">

    {/* iStat-style 紧凑行：左 label 右 value，tabular-nums 防数字抖动 */}
    <HStack className="items-center">
      <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">CPU</Text>
      <Spacer/>
      <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/cpu_text"}}</Text>
    </HStack>

    <HStack className="items-center">
      <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">Memory</Text>
      <Spacer/>
      <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/mem_text"}}</Text>
    </HStack>

    <HStack className="items-center">
      <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">Mem Used</Text>
      <Spacer/>
      <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/mem_pct_text"}}</Text>
    </HStack>

    {/* recent 历史小窗 —— sparkline 还没有，先用 tiny text row 替代（≤5 条） */}
    <VStack gap={1} className="mt-2">
      <Text className="text-xs uppercase tracking-wider text-zinc-400">Recent</Text>
      <DataList collection="metrics">
        <Item>
          <Text className="text-xs tabular-nums text-zinc-500">CPU {{op:"bind_item", field:"cpu_pct"}}%</Text>
        </Item>
      </DataList>
    </VStack>
  </VStack>
</Page>
