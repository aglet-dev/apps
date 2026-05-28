<Tray id="main">
  <TrayLabel>
    <Icon symbol="gauge.medium"/>
    <Text>{{op:"state", path:"/state/menubar_title"}}</Text>
  </TrayLabel>

  <TrayPopover>
    <VStack gap={12} className="px-3 py-3 select-none w-[320px]">

      <VStack gap={6}>
        <HStack className="items-center">
          <Text className="text-xs font-semibold uppercase tracking-wider">Claude</Text>
          <Spacer/>
          <Text className="text-xs tabular-nums text-zinc-400">{{op:"state", path:"/state/claude_cost_text"}}</Text>
        </HStack>
        <VStack gap={2}>
          <HStack className="items-center">
            <Text className="text-[11px] uppercase tracking-wider text-zinc-500">Session</Text>
            <Spacer/>
            <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/claude_session_pct_text"}}</Text>
          </HStack>
          <Chart
            collection="samples"
            query={{ where:{source:"claude"}, orderBy:[{field:"ts",direction:"asc"}], limit:60 }}
            kind="bar"
            xField="ts"
            yField="session_pct"
            yUnit="%"
            yMin={0}
            yMax={100}
            baseline={0}
            threshold={80}
            thresholdColor="warning"
            color="accent"
            xFormat="relative"
            height={36}
            sparkline
          />
          <Text className="text-[10px] text-zinc-500">resets {{op:"state", path:"/state/claude_session_reset_text"}}</Text>
        </VStack>
        <VStack gap={2}>
          <HStack className="items-center">
            <Text className="text-[11px] uppercase tracking-wider text-zinc-500">Week (all models)</Text>
            <Spacer/>
            <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/claude_weekly_pct_text"}}</Text>
          </HStack>
          <Chart
            collection="samples"
            query={{ where:{source:"claude"}, orderBy:[{field:"ts",direction:"asc"}], limit:60 }}
            kind="bar"
            xField="ts"
            yField="weekly_pct"
            yUnit="%"
            yMin={0}
            yMax={100}
            baseline={0}
            threshold={80}
            thresholdColor="warning"
            color="accent"
            xFormat="relative"
            height={36}
            sparkline
          />
          <Text className="text-[10px] text-zinc-500">resets {{op:"state", path:"/state/claude_weekly_reset_text"}}</Text>
        </VStack>
        <Text className="text-[10px] text-amber-500">{{op:"state", path:"/state/claude_err"}}</Text>
      </VStack>

      <VStack gap={6}>
        <HStack className="items-center gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wider">Codex</Text>
          <Text className="text-[10px] uppercase text-zinc-400">{{op:"state", path:"/state/codex_source_text"}}</Text>
          <Spacer/>
          <Text className="text-xs text-zinc-400">{{op:"state", path:"/state/codex_plan_text"}}</Text>
          <Text className="text-xs tabular-nums text-zinc-500">{{op:"state", path:"/state/codex_credits_text"}}</Text>
        </HStack>
        <VStack gap={2}>
          <HStack className="items-center">
            <Text className="text-[11px] uppercase tracking-wider text-zinc-500">5h window</Text>
            <Spacer/>
            <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/codex_session_pct_text"}}</Text>
          </HStack>
          <Chart
            collection="samples"
            query={{ where:{source:"codex"}, orderBy:[{field:"ts",direction:"asc"}], limit:60 }}
            kind="bar"
            xField="ts"
            yField="session_pct"
            yUnit="%"
            yMin={0}
            yMax={100}
            baseline={0}
            threshold={80}
            thresholdColor="warning"
            color="info"
            xFormat="relative"
            height={36}
            sparkline
          />
          <Text className="text-[10px] text-zinc-500">resets {{op:"state", path:"/state/codex_session_reset_text"}}</Text>
        </VStack>
        <VStack gap={2}>
          <HStack className="items-center">
            <Text className="text-[11px] uppercase tracking-wider text-zinc-500">Week</Text>
            <Spacer/>
            <Text className="text-sm font-semibold tabular-nums">{{op:"state", path:"/state/codex_weekly_pct_text"}}</Text>
          </HStack>
          <Chart
            collection="samples"
            query={{ where:{source:"codex"}, orderBy:[{field:"ts",direction:"asc"}], limit:60 }}
            kind="bar"
            xField="ts"
            yField="weekly_pct"
            yUnit="%"
            yMin={0}
            yMax={100}
            baseline={0}
            threshold={80}
            thresholdColor="warning"
            color="info"
            xFormat="relative"
            height={36}
            sparkline
          />
          <Text className="text-[10px] text-zinc-500">resets {{op:"state", path:"/state/codex_weekly_reset_text"}}</Text>
        </VStack>
        <Text className="text-[10px] text-amber-500">{{op:"state", path:"/state/codex_err"}}</Text>
      </VStack>

    </VStack>
  </TrayPopover>
</Tray>
