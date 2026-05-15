<style>
html, body { overscroll-behavior: none; }
</style>

<script>
const OP_CHARS = ["+", "-", "*", "/"];

function evaluate(expr) {
  // 仅放行纯算式字符 —— 不允许标识符 / 括号 / 转义
  if (!/^[\d.+\-*/]+$/.test(expr)) return NaN;
  try {
    const r = new Function("return (" + expr + ")")();
    if (typeof r !== "number" || !isFinite(r)) return NaN;
    return Number(r.toPrecision(12));
  } catch (_) {
    return NaN;
  }
}

function isOpChar(c) { return OP_CHARS.indexOf(c) >= 0; }

function splitTail(disp) {
  let i = disp.length - 1;
  while (i >= 0 && !isOpChar(disp[i])) i--;
  return [disp.slice(0, i + 1), disp.slice(i + 1)];
}

function reduce(s, action) {
  switch (action.type) {
    case "digit": {
      const d = String(action.n);
      if (s.fresh) return { display: d, expr: "", fresh: false };
      if (s.display === "0") return { display: d, fresh: false };
      return { display: s.display + d, fresh: false };
    }
    case "dot": {
      if (s.fresh) return { display: "0.", expr: "", fresh: false };
      const [, operand] = splitTail(s.display);
      if (operand.includes(".")) return {};
      if (operand === "") return { display: s.display + "0.", fresh: false };
      return { display: s.display + ".", fresh: false };
    }
    case "op": {
      const o = action.o;
      if (s.fresh) return { display: s.display + o, expr: "", fresh: false };
      const lastChar = s.display[s.display.length - 1];
      if (isOpChar(lastChar)) return { display: s.display.slice(0, -1) + o };
      return { display: s.display + o };
    }
    case "equals": {
      let e = s.display;
      while (e.length && isOpChar(e[e.length - 1])) e = e.slice(0, -1);
      if (!e) return {};
      const r = evaluate(e);
      return { display: isFinite(r) ? String(r) : "Error", expr: e, fresh: true };
    }
    case "clear": return { display: "0", expr: "", fresh: true };
    case "backspace": {
      if (s.fresh) return { display: "0", expr: "", fresh: true };
      if (s.display.length <= 1) return { display: "0", fresh: true };
      return { display: s.display.slice(0, -1) };
    }
    case "negate": {
      const [prefix, operand] = splitTail(s.display);
      if (!operand) return {};
      return { display: prefix + (operand.startsWith("-") ? operand.slice(1) : "-" + operand) };
    }
    case "percent": {
      const [prefix, operand] = splitTail(s.display);
      const num = parseFloat(operand);
      if (isNaN(num)) return {};
      return { display: prefix + String(num / 100) };
    }
  }
  return {};
}

function applyPatch(patch, applySetState) {
  if (Object.keys(patch).length === 0) return;
  applySetState(patch);
}

export default {
  digit({ n }, ctx) { applyPatch(reduce(ctx.scope.state, { type: "digit", n }), ctx.setState); },
  dot(_args, ctx) { applyPatch(reduce(ctx.scope.state, { type: "dot" }), ctx.setState); },
  op({ o }, ctx) { applyPatch(reduce(ctx.scope.state, { type: "op", o }), ctx.setState); },
  equals(_args, ctx) { applyPatch(reduce(ctx.scope.state, { type: "equals" }), ctx.setState); },
  clear(_args, ctx) { applyPatch(reduce(ctx.scope.state, { type: "clear" }), ctx.setState); },
  negate(_args, ctx) { applyPatch(reduce(ctx.scope.state, { type: "negate" }), ctx.setState); },
  percent(_args, ctx) { applyPatch(reduce(ctx.scope.state, { type: "percent" }), ctx.setState); },
  backspace(_args, ctx) { applyPatch(reduce(ctx.scope.state, { type: "backspace" }), ctx.setState); },
};
</script>

<Page className="min-h-screen p-4 flex flex-col justify-end select-none [&_button:focus]:outline-none [&_button:focus-visible]:outline-none [&_button]:!ring-0">
  <Heading level={3} content={state.expr}
    className="text-right text-base font-light opacity-60 mb-1 px-2 truncate min-h-[1.25rem]"/>
  <Heading level={1} content={state.display}
    className="text-right text-5xl font-light mb-3 px-2 truncate"/>
  <VStack gap={3}>
    <HStack gap={3} className="justify-between">
      <Button label="AC" className="h-16 w-16 rounded-full bg-zinc-300 text-zinc-900 text-2xl font-medium hover:brightness-105"
        onClick={() => scripts.clear()}/>
      <Button label="+/-" className="h-16 w-16 rounded-full bg-zinc-300 text-zinc-900 text-2xl font-medium hover:brightness-105"
        onClick={() => scripts.negate()}/>
      <Button label="%" className="h-16 w-16 rounded-full bg-zinc-300 text-zinc-900 text-2xl font-medium hover:brightness-105"
        onClick={() => scripts.percent()}/>
      <Button label="÷" className="h-16 w-16 rounded-full bg-orange-500 text-white text-3xl font-medium hover:brightness-110"
        onClick={() => scripts.op({o: "/"})}/>
    </HStack>

    <HStack gap={3} className="justify-between">
      <Button label="7" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => scripts.digit({n: 7})}/>
      <Button label="8" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => scripts.digit({n: 8})}/>
      <Button label="9" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => scripts.digit({n: 9})}/>
      <Button label="×" className="h-16 w-16 rounded-full bg-orange-500 text-white text-3xl font-medium hover:brightness-110"
        onClick={() => scripts.op({o: "*"})}/>
    </HStack>

    <HStack gap={3} className="justify-between">
      <Button label="4" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => scripts.digit({n: 4})}/>
      <Button label="5" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => scripts.digit({n: 5})}/>
      <Button label="6" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => scripts.digit({n: 6})}/>
      <Button label="−" className="h-16 w-16 rounded-full bg-orange-500 text-white text-3xl font-medium hover:brightness-110"
        onClick={() => scripts.op({o: "-"})}/>
    </HStack>

    <HStack gap={3} className="justify-between">
      <Button label="1" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => scripts.digit({n: 1})}/>
      <Button label="2" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => scripts.digit({n: 2})}/>
      <Button label="3" className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => scripts.digit({n: 3})}/>
      <Button label="+" className="h-16 w-16 rounded-full bg-orange-500 text-white text-3xl font-medium hover:brightness-110"
        onClick={() => scripts.op({o: "+"})}/>
    </HStack>

    <HStack gap={3} className="justify-between">
      <Button label="0" className="h-16 w-36 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110 justify-start pl-7"
        onClick={() => scripts.digit({n: 0})}/>
      <Button label="." className="h-16 w-16 rounded-full bg-zinc-700 text-white text-2xl font-medium hover:brightness-110"
        onClick={() => scripts.dot()}/>
      <Button label="=" className="h-16 w-16 rounded-full bg-orange-500 text-white text-3xl font-medium hover:brightness-110"
        onClick={() => scripts.equals()}/>
    </HStack>
  </VStack>
</Page>
