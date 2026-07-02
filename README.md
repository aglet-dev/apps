# aglet-apps

Built-in **aglets** for [Aglet](https://aglet.dev) — small, focused, local-first tools.
Each app is a self-contained workflow: a declarative `aglet.json` manifest + a TSX
`ui.tsx` view + optional QuickJS `scripts.js`. No native code, sandboxed, reviewed in public.

These 4 apps ship with the 0.1.0 release and are published to the
[registry](https://github.com/aglet-dev/registry) (`registry.aglet.dev`).
More aglets land in later releases.

## Apps

| App | id | What it does |
|-----|-----|--------------|
| **HN Reader** | `hn` | Hacker News, AI-translated + summarized, like / block |
| **GitHub PRs** | `gh-prs` | review queue + your open PRs |
| **GitHub Actions** | `gh-actions` | watch + run CI across your active repos |
| **AI Token Usage** | `tokstat` | Claude + Codex token usage — session / weekly, in the menu bar |

The system **Jobs** dashboard ships bundled with Aglet.app itself (see the
[host repo](https://github.com/aglet-dev/aglet)).

## Plugin dependencies

Apps declare required plugins via `manifest.requires`. Only `tokstat` needs a plugin —
the native **stdio** `aicreds` plugin (macOS; from
[aglet-plugins](https://github.com/aglet-dev/plugins)), installed automatically
with the app. `aicreds` only reads the local AI tools' OAuth access token; `tokstat`
itself calls the Claude/Codex usage APIs over HTTP. `gh-prs` / `gh-actions` auto-detect
the `gh` CLI (or a GitHub token); `hn` fetches over HTTP — host capabilities, no plugins.

## Develop

```sh
aglet dev <app-dir>          # hot-reload an app in Aglet.app
aglet build <app-dir>        # validate (dry-run install pipeline)
aglet test <app-dir>/tests/*.test.json   # run scenario tests
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the authoring + publish workflow.

## License

MIT — see [LICENSE](./LICENSE).
