<Page className="bg-zinc-950 min-h-screen p-4 flex flex-col">
  <Spacer/>
  <Heading level={1} content={state.display}
    className="text-right text-7xl font-light text-white mb-3 px-2 truncate"/>
  <VStack gap={3}>
    <HStack gap={3} className="justify-between">
      <Button label="AC" className="h-16 w-16 rounded-full bg-zinc-300 text-zinc-900 text-2xl font-medium hover:brightness-105"
        onClick={() => setState({display: 0, pending: 0, op: "", fresh: true})}/>
      <Button label="+/-" className="h-16 w-16 rounded-full bg-zinc-300 text-zinc-900 text-2xl font-medium hover:brightness-105"
        onClick={() => setState({display: -state.display})}/>
      <Button label="%" className="h-16 w-16 rounded-full bg-zinc-300 text-zinc-900 text-2xl font-medium hover:brightness-105"
        onClick={() => setState({display: state.display / 100})}/>
      <Button label="÷" className="h-16 w-16 rounded-full bg-orange-500 text-white text-3xl font-medium hover:brightness-110"
        onClick={() => setState({
          display: state.op === "+" ? state.pending + state.display :
                   state.op === "-" ? state.pending - state.display :
                   state.op === "*" ? state.pending * state.display :
                   state.op === "/" ? state.pending / state.display :
                                      state.display,
          pending: state.display,
          op: "/",
          fresh: true,
        })}/>
    </HStack>

    <HStack gap={3} className="justify-between">
      <Button label="7" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => setState({display: state.fresh ? 7 : state.display * 10 + 7, fresh: false})}/>
      <Button label="8" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => setState({display: state.fresh ? 8 : state.display * 10 + 8, fresh: false})}/>
      <Button label="9" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => setState({display: state.fresh ? 9 : state.display * 10 + 9, fresh: false})}/>
      <Button label="×" className="h-16 w-16 rounded-full bg-orange-500 text-white text-3xl font-medium hover:brightness-110"
        onClick={() => setState({
          display: state.op === "+" ? state.pending + state.display :
                   state.op === "-" ? state.pending - state.display :
                   state.op === "*" ? state.pending * state.display :
                   state.op === "/" ? state.pending / state.display :
                                      state.display,
          pending: state.display,
          op: "*",
          fresh: true,
        })}/>
    </HStack>

    <HStack gap={3} className="justify-between">
      <Button label="4" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => setState({display: state.fresh ? 4 : state.display * 10 + 4, fresh: false})}/>
      <Button label="5" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => setState({display: state.fresh ? 5 : state.display * 10 + 5, fresh: false})}/>
      <Button label="6" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => setState({display: state.fresh ? 6 : state.display * 10 + 6, fresh: false})}/>
      <Button label="−" className="h-16 w-16 rounded-full bg-orange-500 text-white text-3xl font-medium hover:brightness-110"
        onClick={() => setState({
          display: state.op === "+" ? state.pending + state.display :
                   state.op === "-" ? state.pending - state.display :
                   state.op === "*" ? state.pending * state.display :
                   state.op === "/" ? state.pending / state.display :
                                      state.display,
          pending: state.display,
          op: "-",
          fresh: true,
        })}/>
    </HStack>

    <HStack gap={3} className="justify-between">
      <Button label="1" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => setState({display: state.fresh ? 1 : state.display * 10 + 1, fresh: false})}/>
      <Button label="2" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => setState({display: state.fresh ? 2 : state.display * 10 + 2, fresh: false})}/>
      <Button label="3" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => setState({display: state.fresh ? 3 : state.display * 10 + 3, fresh: false})}/>
      <Button label="+" className="h-16 w-16 rounded-full bg-orange-500 text-white text-3xl font-medium hover:brightness-110"
        onClick={() => setState({
          display: state.op === "+" ? state.pending + state.display :
                   state.op === "-" ? state.pending - state.display :
                   state.op === "*" ? state.pending * state.display :
                   state.op === "/" ? state.pending / state.display :
                                      state.display,
          pending: state.display,
          op: "+",
          fresh: true,
        })}/>
    </HStack>

    <HStack gap={3} className="justify-between">
      <Button label="0" className="h-16 w-36 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110 justify-start pl-7"
        onClick={() => setState({display: state.fresh ? 0 : state.display * 10, fresh: false})}/>
      <Button label="." className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium opacity-50" disabled/>
      <Button label="=" className="h-16 w-16 rounded-full bg-orange-500 text-white text-3xl font-medium hover:brightness-110"
        onClick={() => setState({
          display: state.op === "+" ? state.pending + state.display :
                   state.op === "-" ? state.pending - state.display :
                   state.op === "*" ? state.pending * state.display :
                   state.op === "/" ? state.pending / state.display :
                                      state.display,
          op: "",
          fresh: true,
        })}/>
    </HStack>
  </VStack>
</Page>
