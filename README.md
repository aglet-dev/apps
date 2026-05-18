# aglet-apps

Source repository for community-curated [aglet](https://github.com/agent-rt/aglet)
miniapps. Each subdirectory is a self-contained miniapp; you can pack and
install it locally, or publish to
[aglet-registry](https://github.com/agent-rt/aglet-registry) so others
can `aglet install <id>[@<version>]`.

## Layout

```
<id>/
  <id>.json              # manifest (state / collections / permissions / metadata)
  <id>.ui.tsx            # UI tree, TSX subset → JSON IR at install
  <id>.background.js     # optional QuickJS background worker
  <id>.scripts.js        # optional in-page scripts
  _locales/              # optional i18n bundle (Chrome-ext-style)
    en/messages.json
    zh/messages.json
  icon.png               # optional bundled icon (relative path in manifest)
  screenshots/           # optional bundled screenshots
    1.png
```

See [aglet/AGENTS.md](https://github.com/agent-rt/aglet/blob/main/AGENTS.md)
or run `aglet agents-md` for the full authoring reference.

## Apps in this repo

| id | description |
|---|---|
| calc | Simple calculator with state management |
| gh | GitHub notifications inbox (uses `gh` CLI via background job) |
| jira | Jira ticket viewer (a7n CLI integration) |
| qr | QR scanner, in-page `scripts.js` calling Web APIs |
| reminders | Local reminders with due-time notifications |
| watch-demo | `manifest.watch` derived-state demo |

## Local iteration

```sh
cd calc
aglet validate calc.json --json     # check shape
aglet build calc.json --emit ui     # inspect compiled IR
aglet install calc.json              # persist to SQLite for the running Aglet.app
aglet uninstall calc                 # cleanup
```

## Publishing

```sh
aglet publish ./calc/calc.json --json
```

This packs to a `.aglet` tarball, computes sha256, clones (or syncs)
[aglet-registry](https://github.com/agent-rt/aglet-registry), writes the
artifact + `meta.json` / `index.json`, commits a `publish/<id>-<version>`
branch, pushes, and opens a PR via `gh`. A maintainer reviews and merges;
Cloudflare Pages auto-deploys; `aglet install <id>` works within ~30s of
merge.

See `aglet publish --help` for non-PR (`--no-pr`, `--dry-run`) modes.

## Contributing a new app

1. Fork this repo.
2. Add `<id>/<id>.json` + `<id>/<id>.ui.tsx` (run `aglet new <id>` for a
   skeleton).
3. `aglet validate ./<id>/<id>.json` — must pass cleanly.
4. Open PR with the new directory. Once merged, you (or a maintainer) can
   run `aglet publish` against it to land in the binary registry.

## License

Each subdirectory carries its own `manifest.license` field. The repository
itself is MIT.
