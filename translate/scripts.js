// 本地 LLM 翻译：fetch OpenAI-compat chat completions。
//
// state.endpoint  default http://10.0.0.64:8800/v1/chat/completions
// state.model     default Qwen3.6-35B-A3B (本地一台跑得起的)
// state.target    zh|en|ja|ko|fr|de (UI Select 控制)
//
// 入口：translate({input}, ctx) — input 是要翻译的文字，target 从 state 取。

const LANG_NAME = {
  zh: "Chinese (Simplified)",
  en: "English",
  ja: "Japanese",
  ko: "Korean",
  fr: "French",
  de: "German",
};

export default {
  async translate(args = {}, { setState, scope, dispatch }) {
    const text = (args.input ?? "").trim();
    if (!text) {
      setState({ output: "", error: "请先输入要翻译的文字" });
      return;
    }
    const endpoint = scope?.state?.endpoint || "http://10.0.0.64:8800/v1/chat/completions";
    const model = scope?.state?.model || "";
    const target = args.target || scope?.state?.target || "zh";
    const targetName = LANG_NAME[target] || target;

    setState({ output: "", error: "", loading: true });
    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: `You are a professional translator. Translate the user's text into ${targetName}. Output ONLY the translation, no explanation, no quotes.` },
            { role: "user", content: text },
          ],
          temperature: 0.3,
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
      // 写历史 — 失败不影响主流程
      if (out) {
        try {
          await dispatch("data.create", {
            collection: "history",
            data: {
              input: text,
              output: out,
              target,
              model,
              created_at: new Date().toISOString(),
            },
          });
        } catch (e) {
          // ignore history write errors
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
