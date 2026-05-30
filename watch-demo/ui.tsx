<Page className="p-6">
  <VStack gap={4}>
    <Heading level={2}>Watch + $each / $if Demo</Heading>
    <Text>a = {state.a}</Text>
    <Text>double (watch /state/a) = {state.double}</Text>
    <Text>label (watch /state/a) = {state.label}</Text>

    <Text muted>map+join over [1,2,3]:</Text>
    <Text>{[1,2,3].map(item => item * state.a).join(", ")}</Text>

    <Text muted>if (a &gt; 0):</Text>
    <Text>{state.a && "positive"}</Text>

    <Text muted>length:</Text>
    <Text>[1,2,3,4,5].length = {[1,2,3,4,5].length}</Text>
    <Text>state.xs.length = {state.xs.length}</Text>

    <HStack gap={3}>
      <Button label="+1" color="primary"
        onClick={() => setState({a: state.a + 1})}/>
      <Button label="-1"
        onClick={() => setState({a: state.a - 1})}/>
      <Button label="reset"
        onClick={() => setState({a: 0})}/>
    </HStack>
  </VStack>
</Page>
