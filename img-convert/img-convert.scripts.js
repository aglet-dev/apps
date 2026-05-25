// img-convert.scripts.js —— 粘贴图 → image plugin convert → 显示 + 拷回。
//
// 链路：
//   1. paste()  : clipboard.readImage 拿 RGBA pixels → 转 PNG（webp 编小没必要再压）
//                 实际上 clipboard plugin 已经把 NSPasteboard 的图给我们了，
//                 但格式是 RGBA pixels 不是 PNG bytes。所以这里要先把 RGBA
//                 拼成一个 PNG (image.convert with rgba→png 不直接支持，
//                 因为 image plugin 输入是 encoded bytes 不是 raw pixels)。
//                 简化：把 RGBA 写成一个最小 PNG header 嵌进去？太复杂。
//                 直接换思路：用 macOS NSPasteboard 还提供 NSPasteboardTypePNG，
//                 我们 clipboard plugin 现在只暴露 RGBA pixels。为简化 v1，
//                 这个 aglet 不通过 clipboard 进图，靠 metadata() 看作者把
//                 base64 PNG 字符串塞 state.src_dataurl。
//
// v1 工作流（最简）：
//   作者 / 自动化把 src_dataurl 设为 "data:image/png;base64,..."
//   → metadata() / convert() 走 image plugin
//   → 把 out_dataurl 写到 clipboard.writeImage
//
// v1.5：扩 clipboard plugin readImagePNG 拿原始 PNG bytes，不丢失（不走 RGBA 解再编）。

function stripDataUrl(s) {
  return String(s || "").replace(/^data:[^;]+;base64,/, "");
}

export default {
  async refresh({ src_dataurl }, { setState, plugins }) {
    const b64 = stripDataUrl(src_dataurl);
    if (!b64) return setState({ src_meta: "", error: "" });
    try {
      const m = await plugins.image.metadata({ input_b64: b64 });
      setState({ src_meta: `${m.format} ${m.width}×${m.height}`, error: "" });
    } catch (e) {
      setState({ src_meta: "", error: String(e.message || e) });
    }
  },

  async convert({ src_dataurl, format, quality }, { setState, plugins }) {
    const b64 = stripDataUrl(src_dataurl);
    if (!b64) return setState({ out_dataurl: "", out_meta: "", error: "需要先贴图" });
    const fmt = format || "webp";
    const q = Number(quality) || 85;
    try {
      const r = await plugins.image.process({
        input_b64: b64,
        output_format: fmt,
        quality: q,
        lossless: false,
      });
      const mime = fmt === "jpeg" ? "image/jpeg" : `image/${fmt}`;
      setState({
        out_dataurl: `data:${mime};base64,${r.output_b64}`,
        out_meta: `${r.format} ${r.width}×${r.height} (${Math.round(r.output_b64.length * 0.75 / 1024)} KB)`,
        error: "",
      });
    } catch (e) {
      setState({ out_dataurl: "", out_meta: "", error: String(e.message || e) });
    }
  },

  async copyOut(_args, { state, setState, plugins }) {
    if (!state.out_dataurl) return;
    try {
      const png_b64 = stripDataUrl(state.out_dataurl);
      await plugins.clipboard.writeImage({ png_b64 });
    } catch (e) {
      setState({ error: String(e.message || e) });
    }
  },
};
