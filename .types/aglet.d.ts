// Aglet scripts.js type definitions.
//
// 用法：scripts.js 顶部加
//   /// <reference path="../.types/aglet.d.ts" />
// IDE / TS LSP 即可补全 ctx / aglet / scripts.<fn> 签名。
//
// 跟 aglet-host/src/scripts.zig 的 ctx 注入 + aglet-host/src/js_bindings.zig
// 的全局绑定对齐；新加 binding 同步改这里。

// ─── ctx (scripts.<fn> 第二参) ────────────────────────────────────────────────

/** Reactive state patch；string 键映射到 /state/<k> JSON pointer。 */
type StatePatch = Record<string, unknown>;

/** Plugin action 调用结果 envelope —— bridge 返回的标准形态。 */
interface PluginResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: { code: string; message?: string };
}

/** Plugin namespace handle，dynamic call shape；action 名 / 参数依各 plugin manifest。 */
type PluginNamespace = Record<string, (params?: Record<string, unknown>) => Promise<PluginResult>>;

/** scripts.<fn>(args, ctx) 的 ctx 形态。 */
interface ScriptCtx {
  /** 完整 scope tree（含 /form /item /settings /state），eval directive 用。 */
  scope: Record<string, unknown>;

  /** 写多个 /state/<k> = v 一把。background job 无活窗口时 no-op + warn。 */
  setState(patch: StatePatch): void;

  /** 写单个 JSON pointer 路径。background job 无活窗口时 no-op + warn。 */
  setStateAt(path: string, value: unknown): void;

  /** 调 bridge action（data.* / app.* / 其它）。返 envelope。 */
  dispatch(action: string, params?: Record<string, unknown>): Promise<unknown>;

  /** Plugin namespace：`ctx.plugins.encoding.decodeBase32({s: "..."})` 这种调用形式。 */
  plugins: Record<string, PluginNamespace>;

  /**
   * 当前时间（epoch ms）。**优先于 Date.now()**：scenario 测试可 freeze 时间
   * 验"T=X 时 TOTP code 为 Y"这类断言。time-sensitive 逻辑（TOTP / pomodoro /
   * 任何依赖墙钟）必须用 ctx.now() 不直接 Date.now()。
   */
  now(): number;
}

// ─── aglet 全局 (handler / background.js 内可用) ─────────────────────────────

/** data.list / data.create / data.update / data.delete 等同步包装。 */
interface AgletDataApi {
  list(appId: string, collection: string, query?: {
    limit?: number;
    offset?: number;
    orderBy?: Array<{ field: string; direction?: "asc" | "desc" }>;
    where?: Record<string, unknown>;
  }): { items: Array<{ id: string; data: Record<string, unknown>; created_at: string; updated_at: string }> };

  get(appId: string, collection: string, id: string): { record: Record<string, unknown> } | null;

  create(appId: string, collection: string, data: Record<string, unknown>): { id: string };

  update(appId: string, collection: string, id: string, patch: Record<string, unknown>): void;

  delete(appId: string, collection: string, id: string): void;

  search(appId: string, collection: string, query: { q: string; limit?: number }): {
    items: Array<{ id: string; data: Record<string, unknown> }>;
  };
}

/** aglet 全局 namespace（scripts / background.js 内可见）。 */
interface AgletGlobal {
  /** 异步 bridge 调用：dispatch 任意 action。`ctx.dispatch` 是它的快捷方式。 */
  bridge(appId: string, action: string, params: Record<string, unknown>): Promise<unknown>;

  data: AgletDataApi;

  /** Settings 读写（持久化 key/value，per-aglet 命名空间）。 */
  settings: {
    get(appId: string, key: string): unknown;
    set(appId: string, key: string, value: unknown): void;
  };

  /** Plugin namespace 镜像（同 ctx.plugins，handler 外也能用）。 */
  plugins: Record<string, PluginNamespace>;
}

declare global {
  const aglet: AgletGlobal;
}

// ─── scripts.js 模块导出形态 ──────────────────────────────────────────────────

/** scripts.<name>(args, ctx) 的 handler 形态。返回值会被 ctx.scripts.<name> 拿到。 */
export type ScriptHandler<Args = unknown, Result = unknown> =
  (args: Args, ctx: ScriptCtx) => Result | Promise<Result>;

/** scripts.js `export default` 形态。handler 名跟 manifest.jobs[].handler / TSX 的
 * `scripts.<name>()` 调用对齐；types 不强制，由 manifest 校验。 */
export interface ScriptsModule {
  [handler: string]: ScriptHandler;
}

export {};
