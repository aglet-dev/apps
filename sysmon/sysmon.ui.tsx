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

    {/* CPU sparkline —— Chart line mode 紧凑高度，最近 60 个点（≈ 60s @ 1Hz） */}
    <VStack gap={1} className="mt-2">
      <Text className="text-xs uppercase tracking-wider text-zinc-400">CPU history</Text>
      <Chart collection="metrics"
             query={{orderBy:[{field:"ts",direction:"asc"}], limit:60}}
             xField="ts"
             yField="cpu_pct"
             kind="line"
             sparkline={true}
             height={36}/>
    </VStack>
  </VStack>
</Page>
