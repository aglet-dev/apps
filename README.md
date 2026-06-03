# aglet-apps

Source aglets for [Aglet](https://github.com/agent-rt/aglet) — small
declarative apps that run inside the host. Each subdirectory packs into
a `.aglet` tarball published to
[aglet-registry](https://github.com/agent-rt/aglet-registry).

## Layout

```
<id>/
  <id>.json              # manifest
  <id>.ui.tsx            # UI (TSX subset → JSON IR)
  <id>.scripts.js        # optional in-page scripts
  <id>.background.js     # optional QuickJS worker (legacy; prefer manifest.jobs)
  _locales/              # optional Chrome-ext-style i18n
  icon.png               # optional bundled icon
  screenshots/           # optional bundled screenshots
```

See `aglet agents-md` for the authoring reference, or
[aglet/AGENTS.md](https://github.com/agent-rt/aglet/blob/main/AGENTS.md).

## Local dev

```sh
cd calc
aglet validate calc.json            # check shape
aglet install calc.json             # install into running Aglet.app
aglet uninstall calc
```

## Publish

Tag `<id>-v<version>` and push; CI runs `aglet publish` against
aglet-registry.

```sh
git tag calc-v0.1.0
git push --tags
```

`aglet publish --dry-run` shows what would be sent.

## Apps

| id | description |
|---|---|
| `calc` | iOS-style calculator |
| `copywriter` | LLM-generated product copy |
| `footprint` | Visited places on a map |
| `fx` | Currency conversion + landed-cost |
| `gh` | GitHub review queue (uses `gh` CLI) |
| `hn` | HackerNews reader with translation |
| `img-convert` | Convert PNG/JPEG/WebP/BMP |
| `inbox` | Quick capture + archive notebook |
| `issues` | Lightweight issue tracker |
| `jp-cards` | Japanese SRS flashcards |
| `json` | Format / minify / validate JSON |
| `kanban` | Backlog / In Progress / Done board |
| `ledger` | Income + expense tracking |
| `memory` | Agent long-term memory store |
| `pomodoro` | 25/5 timer |
| `profile` | Profile form (DatePicker/Slider/RadioGroup demo) |
| `qr` | QR encode + decode |
| `reader` | URL → markdown + AI summary |
| `reminders` | Reminders with due-time notifications |
| `sysmon-{cpu,mem,net}` | Menubar system monitors |
| `tasks` | Task list with priority + project |
| `timer` | Countdown timer |
| `translate` | LLM-powered translator |
| `weight` | Daily weight log with chart |

## Contributing

1. Fork.
2. Add `<id>/aglet.json` + `<id>/ui.tsx` (or `aglet new <id>` for a skeleton). Optional: `<id>/scripts.js`, `<id>/locales/`, `<id>/tests/<id>.test.json`.
3. `aglet validate ./<id>/aglet.json` must pass.
4. Open PR. CI validates; a maintainer merges; tag to publish.

## License

Each app declares its own `manifest.license`. The repo itself is MIT.
