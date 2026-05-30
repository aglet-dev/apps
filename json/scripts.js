// JSON 工具脚本：format / minify / validate / clear / copy。
// Pattern: 每个函数签名 (args, ctx)，ctx 提供 setState。
//
// 错误诊断：JSON.parse 的 SyntaxError 在 V8/JSC/QuickJS 上 message 都含
// "at position N" 或 "line:col"。我们做一层 normalize 给用户友好行列。

function locate(input, message) {
  // 常见 "at position N" / "in JSON at position N"
  const posMatch = /position (\d+)/.exec(message);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    let line = 1, col = 1;
    for (let i = 0; i < pos && i < input.length; i++) {
      if (input[i] === "\n") { line++; col = 1; } else { col++; }
    }
    return ` (line ${line}, col ${col})`;
  }
  // Safari 格式 "Unexpected token X. ... at line A column B"
  const lcMatch = /line (\d+) column (\d+)/i.exec(message);
  if (lcMatch) return ` (line ${lcMatch[1]}, col ${lcMatch[2]})`;
  return "";
}

function pretty(value, indent) {
  return JSON.stringify(value, null, indent);
}

export default {
  format(args = {}, { setState }) {
    const input = args?.input ?? "";
    const indent = args?.indent ?? 2;
    if (!input.trim()) {
      setState({ output: "", error: "", info: "" });
      return;
    }
    try {
      const v = JSON.parse(input);
      const out = pretty(v, indent);
      setState({
        output: out,
        error: "",
        info: `✓ valid · ${describe(v)} · ${input.length} → ${out.length} bytes`,
      });
    } catch (e) {
      const where = locate(input, String(e.message || ""));
      setState({ output: "", error: `${e.message || e}${where}`, info: "" });
    }
  },

  minify(args = {}, { setState }) {
    const input = args?.input ?? "";
    if (!input.trim()) return;
    try {
      const v = JSON.parse(input);
      const out = JSON.stringify(v);
      setState({
        output: out,
        error: "",
        info: `✓ valid · minified · ${input.length} → ${out.length} bytes`,
      });
    } catch (e) {
      const where = locate(input, String(e.message || ""));
      setState({ output: "", error: `${e.message || e}${where}`, info: "" });
    }
  },

  validate(args = {}, { setState }) {
    const input = args?.input ?? "";
    if (!input.trim()) {
      setState({ error: "", info: "empty" });
      return;
    }
    try {
      const v = JSON.parse(input);
      setState({ error: "", info: `✓ valid · ${describe(v)}` });
    } catch (e) {
      const where = locate(input, String(e.message || ""));
      setState({ error: `${e.message || e}${where}`, info: "" });
    }
  },

  clear(_args, { setState }) {
    setState({ output: "", error: "", info: "" });
  },
};

function describe(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return `array (${v.length} item${v.length === 1 ? "" : "s"})`;
  const t = typeof v;
  if (t === "object") return `object (${Object.keys(v).length} key${Object.keys(v).length === 1 ? "" : "s"})`;
  return t;
}
