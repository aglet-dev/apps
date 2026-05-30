<Tray id="main">
  <TrayLabel>
    <Sparkline collection="metrics" field="cpu_pct" color="primary"/>
    <Text>{{op:"state", path:"/state/menubar_title"}}</Text>
  </TrayLabel>

  <TrayPopover>
    <VStack gap={6} className="px-3 py-3 select-none">
      <HStack className="items-center">
        <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">CPU</Text>
        <Spacer/>
        <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/cpu_text"}}</Text>
      </HStack>

      <VStack gap={1} className="mt-2">
        <Text className="text-xs uppercase tracking-wider text-zinc-400">History</Text>
        <Chart collection="metrics"
               query={{orderBy:[{field:"ts",direction:"asc"}], limit:60}}
               xField="ts" yField="cpu_pct" kind="line"
               sparkline={true} height={36}/>
      </VStack>
    </VStack>
  </TrayPopover>
</Tray>
