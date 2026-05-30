<script>
export default {
  inc(_args, ctx) { ctx.setState({ count: (ctx.scope.state.count ?? 0) + 1 }); },
  dec(_args, ctx) { ctx.setState({ count: (ctx.scope.state.count ?? 0) - 1 }); },
  reset(_args, ctx) { ctx.setState({ count: 0 }); },
};
</script>

<Page className="min-h-screen p-6 flex flex-col justify-center items-center gap-6 select-none">
  <Text className="text-sm uppercase tracking-widest opacity-60">Count</Text>
  <Heading level={1} content={state.count} className="text-7xl font-light tabular-nums"/>
  <HStack gap={3}>
    <Button label="−1" color="secondary" onClick={() => scripts.dec()}/>
    <Button label="Reset" variant="bordered" onClick={() => scripts.reset()}/>
    <Button label="+1" color="primary" onClick={() => scripts.inc()}/>
  </HStack>
</Page>
