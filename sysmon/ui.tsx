<Tray id="main">
  {/* TrayLabel: menubar 上 statusItem 显示。 */}
  <TrayLabel>
    <Icon symbol="cpu"/>
    <Text>{{op:"state", path:"/state/menubar_title"}}</Text>
  </TrayLabel>

  {/* TrayPopover: 点 statusItem 弹出。每指标一行 label+值 + Meter 条（iStat 风）。 */}
  <TrayPopover>
    <VStack gap={10} className="px-4 py-3 select-none">

      <VStack gap={1}>
        <HStack className="items-center">
          <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">CPU</Text>
          <Spacer/>
          <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/cpu_text"}}</Text>
        </HStack>
        <Meter value={{op:"state", path:"/state/cpu_pct"}} min={0} max={100} color={{op:"state", path:"/state/cpu_color"}}/>
      </VStack>

      <VStack gap={1}>
        <HStack className="items-center">
          <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">Memory</Text>
          <Spacer/>
          <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/mem_text"}}</Text>
        </HStack>
        <Meter value={{op:"state", path:"/state/mem_pct"}} min={0} max={100} color={{op:"state", path:"/state/mem_color"}}/>
      </VStack>

      <VStack gap={1}>
        <HStack className="items-center">
          <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">Disk</Text>
          <Spacer/>
          <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/disk_text"}}</Text>
        </HStack>
        <Meter value={{op:"state", path:"/state/disk_pct"}} min={0} max={100} color={{op:"state", path:"/state/disk_color"}}/>
      </VStack>

      <VStack gap={1}>
        <HStack className="items-center">
          <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">GPU</Text>
          <Spacer/>
          <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/gpu_text"}}</Text>
        </HStack>
        <Meter value={{op:"state", path:"/state/gpu_pct"}} min={0} max={100} color={{op:"state", path:"/state/gpu_color"}}/>
      </VStack>

      <VStack gap={1}>
        <HStack className="items-center">
          <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">Battery</Text>
          <Spacer/>
          <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/batt_text"}}</Text>
        </HStack>
        <Meter value={{op:"state", path:"/state/batt_pct"}} min={0} max={100} color={{op:"state", path:"/state/batt_color"}}/>
      </VStack>

      <VStack gap={1}>
        <HStack className="items-center">
          <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">Temp</Text>
          <Spacer/>
          <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/temp_text"}}</Text>
        </HStack>
        <Meter value={{op:"state", path:"/state/temp_pct"}} min={0} max={100} color={{op:"state", path:"/state/temp_color"}}/>
      </VStack>

      <VStack gap={1}>
        <HStack className="items-center">
          <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">Fan</Text>
          <Spacer/>
          <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/fan_text"}}</Text>
        </HStack>
      </VStack>

      <VStack gap={1}>
        <HStack className="items-center">
          <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">Network</Text>
          <Spacer/>
          <Text className="text-sm font-semibold tabular-nums">↓ {{op:"state", path:"/state/net_rx_text"}}  ↑ {{op:"state", path:"/state/net_tx_text"}}</Text>
        </HStack>
      </VStack>

      <Divider/>

      <VStack gap={1}>
        <Text className="text-xs uppercase tracking-wider text-zinc-400">CPU history</Text>
        <Chart collection="metrics"
               query={{orderBy:[{field:"ts",direction:"asc"}], limit:60}}
               xField="ts" yField="cpu_pct" kind="line"
               yMin={0} yMax={100}
               sparkline={true} height={36}/>
      </VStack>

      <VStack gap={1}>
        <Text className="text-xs uppercase tracking-wider text-zinc-400">Network ↓ KB/s</Text>
        <Chart collection="metrics"
               query={{orderBy:[{field:"ts",direction:"asc"}], limit:60}}
               xField="ts" yField="rx_kbps" kind="line"
               sparkline={true} height={36}/>
      </VStack>
    </VStack>
  </TrayPopover>
</Tray>
