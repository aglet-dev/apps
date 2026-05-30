// 商品文案生成：fetch OpenAI-compat 端点，prompt 模板要求 LLM 输出 3 条候选。
//
// 输入字段：name / selling_points / audience / platform / tone
// 输出：state.output (markdown 多条候选)

const TONE_HINT = {
  professional: "专业、可信、强调数据与权威感",
  playful: "活泼、年轻化、可适度使用 emoji",
  minimal: "简洁、克制、几句话点到为止",
  story: "故事化叙事，先讲场景再点产品",
};

export default {
  async generate(args = {}, { setState, scope, dispatch }) {
    const name = (args.name ?? "").trim();
    if (!name) {
      setState({ output: "", error: "请填商品名" });
      return;
    }
    const points = args.selling_points || "";
    const audience = args.audience || "通用";
    const platform = args.platform || "通用";
    const tone = args.tone || "professional";

    const endpoint = scope?.state?.endpoint || "http://10.0.0.64:8800/v1/chat/completions";
    const model = scope?.state?.model || "";
    const toneHint = TONE_HINT[tone] || tone;

    const sys = `你是一位资深电商文案。根据用户输入的商品信息，输出 3 条不同风格的中文短文案，每条 80-120 字。基调：${toneHint}。每条文案前用 \`### 候选 N\` 作为 markdown 三级标题分隔。不要任何 meta 解释。`;
    const user = `商品名：${name}
卖点：${points || "（自行发挥）"}
目标受众：${audience}
投放平台：${platform}`;

    setState({ output: "", error: "", loading: true });
    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: sys },
            { role: "user", content: user },
          ],
          temperature: 0.8,
          max_tokens: 1024,
          stream: false,
        }),
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${body.slice(0, 200)}`);
      }
      const data = await resp.json();
      const out = (data?.choices?.[0]?.message?.content ?? "").trim();
      setState({ output: out, error: "", loading: false });
      if (out) {
        try {
          await dispatch("data.create", {
            collection: "history",
            data: {
              name, selling_points: points, audience, platform, tone,
              output: out, model,
              created_at: new Date().toISOString(),
            },
          });
        } catch (e) {
          // ignore history write
        }
      }
    } catch (e) {
      setState({ output: "", error: String(e.message || e), loading: false });
    }
  },

  clear(_args, { setState }) {
    setState({ output: "", error: "" });
  },
};
