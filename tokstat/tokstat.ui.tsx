<Tray id="main">
  <TrayLabel>
    <Icon symbol="gauge.medium"/>
    <Text>{{op:"state", path:"/state/menubar_title"}}</Text>
  </TrayLabel>

  <TrayPopover>
    <VStack gap={8} className="px-3 py-3 select-none">
      <HStack className="items-center">
        <Text className="text-xs font-medium uppercase tracking-wider text-zinc-500">Claude usage</Text>
        <Spacer/>
        <Text className="text-xs tabular-nums text-zinc-400">{{op:"state", path:"/state/cost_text"}}</Text>
      </HStack>

      <VStack gap={2}>
        <HStack className="items-center">
          <Text className="text-xs uppercase tracking-wider text-zinc-500">Session</Text>
          <Spacer/>
          <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/session_pct_text"}}</Text>
        </HStack>
        <Text className="font-mono text-[11px] tracking-tight">{{op:"state", path:"/state/session_bar"}}</Text>
        <Text className="text-[11px] text-zinc-500">resets {{op:"state", path:"/state/session_reset_text"}}</Text>
      </VStack>

      <VStack gap={2}>
        <HStack className="items-center">
          <Text className="text-xs uppercase tracking-wider text-zinc-500">Week (all models)</Text>
          <Spacer/>
          <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/weekly_pct_text"}}</Text>
        </HStack>
        <Text className="font-mono text-[11px] tracking-tight">{{op:"state", path:"/state/weekly_bar"}}</Text>
        <Text className="text-[11px] text-zinc-500">resets {{op:"state", path:"/state/weekly_reset_text"}}</Text>
      </VStack>

      <Text className="text-[10px] text-amber-500">{{op:"state", path:"/state/error_text"}}</Text>
    </VStack>
  </TrayPopover>
</Tray>
