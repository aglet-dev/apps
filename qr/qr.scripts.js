// qr.scripts.js —— 1.1：替掉 2300 行 Kazuhiko Arase 内联 encoder，全走
// barcode plugin（zxing-cpp via wasmtime / wasm-EH）。manifest.requires 保证
// 加载时 barcode plugin 存在 + permissions 已声明。
//
// scan：v1.1 还没接 clipboard plugin（OS-bound，三端各实现），暂时 web
// 端用 BarcodeDetector fallback。clipboard 落地后会替成 plugins.clipboard
// + plugins.barcode.decode 的两步链。

export default {
  async encode({ text }, { setState, plugins }) {
    if (!text) return setState({ qr: "", error: "" });
    try {
      const { dataUrl } = await plugins.barcode.encode({
        text,
        format: "QRCode",
        ecc: 1, // M
        margin: 4,
        width: 200,
        height: 200,
      });
      setState({ qr: dataUrl, error: "" });
    } catch (e) {
      setState({ qr: "", error: String(e.message || e) });
    }
  },

  // 把编出来的 QR PNG 写回剪贴板。state.qr 形如 "data:image/png;base64,XXXX"
  async copyImage(_args, { state, setState, plugins }) {
    if (!state.qr) return;
    try {
      const png_b64 = String(state.qr).replace(/^data:image\/png;base64,/, "");
      await plugins.clipboard.writeImage({ png_b64 });
    } catch (e) {
      setState({ error: String(e.message || e) });
    }
  },

  // 解码出来的文本写回剪贴板
  async copyText(_args, { state, setState, plugins }) {
    if (!state.decoded) return;
    try {
      await plugins.clipboard.writeText({ text: state.decoded });
    } catch (e) {
      setState({ error: String(e.message || e) });
    }
  },

  // 三步插件链 —— 每个 plugin 各管各的原语：
  //   clipboard.readImage  → 拿原生 PNG/TIFF/JPEG 字节
  //   image.decode         → 解到 RGBA pixels (wasmtime/stb)
  //   barcode.decode       → RGBA pixels 上跑 QR detector (wasmtime/zxing)
  // 中间不 lossy 转换；image plugin 不存在的平台可以走别的 decoder。
  async scan(_args, { setState, plugins }) {
    try {
      const img = await plugins.clipboard.readImage();
      if (!img || !img.found) {
        return setState({ decoded: "", error: "剪贴板里没图片" });
      }
      const dec = await plugins.image.decode({ input_b64: img.bytes_b64 });
      const r = await plugins.barcode.decode({
        width: dec.width,
        height: dec.height,
        pixels_b64: dec.pixels_b64,
      });
      setState({ decoded: r.text, error: "" });
    } catch (e) {
      setState({ decoded: "", error: String(e.message || e) });
    }
  },
};
