<Tray id="main">
  {/* TrayLabel: menubar 上 statusItem 显示。Phase C v1.5 支持 <Icon> + <Text>。 */}
  <TrayLabel>
    <Icon symbol="cpu"/>
    <Text>{{op:"state", path:"/state/menubar_title"}}</Text>
  </TrayLabel>

  {/* TrayPopover: 点 statusItem 弹出的 popover 内容 —— 自由 UI */}
  <TrayPopover>
    <VStack gap={6} className="px-3 py-3 select-none">
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

      <VStack gap={1} className="mt-2">
        <Text className="text-xs uppercase tracking-wider text-zinc-400">CPU history</Text>
        <Chart collection="metrics"
               query={{orderBy:[{field:"ts",direction:"asc"}], limit:60}}
               xField="ts" yField="cpu_pct" kind="line"
               sparkline={true} height={36}/>
      </VStack>
    </VStack>
  </TrayPopover>
</Tray>
