<Tray id="main" onClick="popover">
  <TrayLabel>
    <Text>{{op:"concat", args:["CL ", {op:"data", collection:"current", where:{source:"claude"}, latest:true, field:"menu_text"}]}}</Text>
    <Text>{{op:"concat", args:["CX ", {op:"data", collection:"current", where:{source:"codex"}, latest:true, field:"menu_text"}]}}</Text>
  </TrayLabel>

  <TrayMenu>
    <TrayMenuItem label="Refresh now" onSelect="refreshNow"/>
    <TrayMenuItem label="Quit" quit/>
  </TrayMenu>

  <TrayPopover>
    <VStack gap={8} className="px-3 py-2 select-none w-[280px]">

      <DataScope alias="cl" collection="current" query={{where:{source:"claude"}}} latest>
        <VStack gap={3}>
          <HStack className="items-center">
            <Text className="text-[11px] font-semibold uppercase tracking-wider">Claude</Text>
            <Spacer/>
            <Text className="text-[10px] tabular-nums text-zinc-400">{{op:"state", path:"/data/cl/cost_text"}}</Text>
          </HStack>
          <VStack gap={1}>
            <HStack className="items-center">
              <Text className="text-[10px] uppercase tracking-wider text-zinc-500">Session</Text>
              <Spacer/>
              <Text className="text-xs font-semibold tabular-nums">{{op:"state", path:"/data/cl/session_pct_text"}}</Text>
            </HStack>
            <Progress
              value={{op:"state", path:"/data/cl/session_pct"}}
              max={100}
              color={{op:"state", path:"/data/cl/session_color"}}
              size="sm"
            />
            <Text className="text-[10px] text-zinc-500 leading-tight">resets {{op:"state", path:"/data/cl/session_reset_text"}}</Text>
          </VStack>
          <VStack gap={1}>
            <HStack className="items-center">
              <Text className="text-[10px] uppercase tracking-wider text-zinc-500">Week</Text>
              <Spacer/>
              <Text className="text-xs font-semibold tabular-nums">{{op:"state", path:"/data/cl/weekly_pct_text"}}</Text>
            </HStack>
            <Progress
              value={{op:"state", path:"/data/cl/weekly_pct"}}
              max={100}
              color={{op:"state", path:"/data/cl/weekly_color"}}
              size="sm"
            />
            <Text className="text-[10px] text-zinc-500 leading-tight">resets {{op:"state", path:"/data/cl/weekly_reset_text"}}</Text>
          </VStack>
          <Text className="text-[10px] text-amber-500 leading-tight">{{op:"state", path:"/data/cl/err"}}</Text>
        </VStack>
      </DataScope>

      <DataScope alias="cx" collection="current" query={{where:{source:"codex"}}} latest>
        <VStack gap={3}>
          <HStack className="items-center gap-1.5">
            <Text className="text-[11px] font-semibold uppercase tracking-wider">Codex</Text>
            <Text className="text-[9px] uppercase text-zinc-400">{{op:"state", path:"/data/cx/source_text"}}</Text>
            <Spacer/>
            <Text className="text-[10px] text-zinc-400">{{op:"state", path:"/data/cx/plan_text"}}</Text>
            <Text className="text-[10px] tabular-nums text-zinc-500">{{op:"state", path:"/data/cx/credits_text"}}</Text>
          </HStack>
          <VStack gap={1}>
            <HStack className="items-center">
              <Text className="text-[10px] uppercase tracking-wider text-zinc-500">5h</Text>
              <Spacer/>
              <Text className="text-xs font-semibold tabular-nums">{{op:"state", path:"/data/cx/session_pct_text"}}</Text>
            </HStack>
            <Progress
              value={{op:"state", path:"/data/cx/session_pct"}}
              max={100}
              color={{op:"state", path:"/data/cx/session_color"}}
              size="sm"
            />
            <Text className="text-[10px] text-zinc-500 leading-tight">resets {{op:"state", path:"/data/cx/session_reset_text"}}</Text>
          </VStack>
          <VStack gap={1}>
            <HStack className="items-center">
              <Text className="text-[10px] uppercase tracking-wider text-zinc-500">Week</Text>
              <Spacer/>
              <Text className="text-xs font-semibold tabular-nums">{{op:"state", path:"/data/cx/weekly_pct_text"}}</Text>
            </HStack>
            <Progress
              value={{op:"state", path:"/data/cx/weekly_pct"}}
              max={100}
              color={{op:"state", path:"/data/cx/weekly_color"}}
              size="sm"
            />
            <Text className="text-[10px] text-zinc-500 leading-tight">resets {{op:"state", path:"/data/cx/weekly_reset_text"}}</Text>
          </VStack>
          <Text className="text-[10px] text-amber-500 leading-tight">{{op:"state", path:"/data/cx/err"}}</Text>
        </VStack>
      </DataScope>

    </VStack>
  </TrayPopover>
</Tray>
