<Tray id="main" onClick="popover">
  <TrayLabel>
    <Text>{{op:"if", cond:{op:"ne", a:{op:"state", path:"/settings/show"}, b:"codex"}, then:{op:"concat", args:["CL ", {op:"if", cond:{op:"data", collection:"current", where:{source:"claude"}, latest:true, field:"menu_text"}, then:{op:"data", collection:"current", where:{source:"claude"}, latest:true, field:"menu_text"}, else:"…"}]}, else:""}}</Text>
    <Text>{{op:"if", cond:{op:"ne", a:{op:"state", path:"/settings/show"}, b:"claude"}, then:{op:"concat", args:["CX ", {op:"if", cond:{op:"data", collection:"current", where:{source:"codex"}, latest:true, field:"menu_text"}, then:{op:"data", collection:"current", where:{source:"codex"}, latest:true, field:"menu_text"}, else:"…"}]}, else:""}}</Text>
  </TrayLabel>

  <TrayMenu>
    <TrayMenuItem label={t.menuRefresh} onSelect="refreshNow"/>
    <TrayMenuItem label={t.menuQuit} quit/>
  </TrayMenu>

  <TrayPopover>
    <VStack gap={8} className="px-3 py-2 select-none w-[280px]">

      {state.show_claude && (
      <DataScope alias="cl" collection="current" query={{where:{source:"claude"}}} latest>
        <VStack gap={3}>
          <HStack className="items-center">
            <Text className="text-[11px] font-semibold uppercase tracking-wider">Claude</Text>
            <Spacer/>
            <Text className="text-[10px] tabular-nums text-zinc-300">{data.cl.cost_text}</Text>
          </HStack>
          <VStack gap={1}>
            <HStack className="items-center">
              <Text className="text-[10px] uppercase tracking-wider text-zinc-300">{t.session}</Text>
              <Spacer/>
              <Text className="text-xs font-semibold tabular-nums">{data.cl.session_pct_text}</Text>
            </HStack>
            <Progress value={data.cl.session_pct} max={100} color={data.cl.session_color} size="sm"/>
            <Text className="text-[10px] text-zinc-300 leading-tight">{t.resets} {data.cl.session_reset_text}</Text>
          </VStack>
          <VStack gap={1}>
            <HStack className="items-center">
              <Text className="text-[10px] uppercase tracking-wider text-zinc-300">{t.week}</Text>
              <Spacer/>
              <Text className="text-xs font-semibold tabular-nums">{data.cl.weekly_pct_text}</Text>
            </HStack>
            <Progress value={data.cl.weekly_pct} max={100} color={data.cl.weekly_color} size="sm"/>
            <Text className="text-[10px] text-zinc-300 leading-tight">{t.resets} {data.cl.weekly_reset_text}</Text>
          </VStack>
          <Text className="text-[10px] text-amber-500 leading-tight">{data.cl.err}</Text>
        </VStack>
      </DataScope>
      )}

      {state.show_codex && (
      <DataScope alias="cx" collection="current" query={{where:{source:"codex"}}} latest>
        <VStack gap={3}>
          <HStack className="items-center gap-1.5">
            <Text className="text-[11px] font-semibold uppercase tracking-wider">Codex</Text>
            <Text className="text-[9px] uppercase text-zinc-300">{data.cx.source_text}</Text>
            <Spacer/>
            <Text className="text-[10px] text-zinc-300">{data.cx.plan_text}</Text>
            <Text className="text-[10px] tabular-nums text-zinc-300">{data.cx.credits_text}</Text>
          </HStack>
          <VStack gap={1}>
            <HStack className="items-center">
              <Text className="text-[10px] uppercase tracking-wider text-zinc-300">5h</Text>
              <Spacer/>
              <Text className="text-xs font-semibold tabular-nums">{data.cx.session_pct_text}</Text>
            </HStack>
            <Progress value={data.cx.session_pct} max={100} color={data.cx.session_color} size="sm"/>
            <Text className="text-[10px] text-zinc-300 leading-tight">{t.resets} {data.cx.session_reset_text}</Text>
          </VStack>
          <VStack gap={1}>
            <HStack className="items-center">
              <Text className="text-[10px] uppercase tracking-wider text-zinc-300">{t.week}</Text>
              <Spacer/>
              <Text className="text-xs font-semibold tabular-nums">{data.cx.weekly_pct_text}</Text>
            </HStack>
            <Progress value={data.cx.weekly_pct} max={100} color={data.cx.weekly_color} size="sm"/>
            <Text className="text-[10px] text-zinc-300 leading-tight">{t.resets} {data.cx.weekly_reset_text}</Text>
          </VStack>
          <Text className="text-[10px] text-amber-500 leading-tight">{data.cx.err}</Text>
        </VStack>
      </DataScope>
      )}

    </VStack>
  </TrayPopover>
</Tray>
