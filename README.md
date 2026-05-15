# corelet-apps

Source repository for community-curated [corelet](https://github.com/agent-rt/corelet)
miniapps. Each subdirectory is a self-contained miniapp; you can pack and
install it locally, or publish to
[corelet-registry](https://github.com/agent-rt/corelet-registry) so others
can `corelet install <id>[@<version>]`.

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

See [corelet/AGENTS.md](https://github.com/agent-rt/corelet/blob/main/AGENTS.md)
or run `corelet agents-md` for the full authoring reference.

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
corelet validate calc.json --json     # check shape
corelet build calc.json --emit ui     # inspect compiled IR
corelet install calc.json              # persist to SQLite for the running Corelet.app
corelet uninstall calc                 # cleanup
```

## Publishing

```sh
corelet publish ./calc/calc.json --json
```

This packs to a `.corelet` tarball, computes sha256, clones (or syncs)
[corelet-registry](https://github.com/agent-rt/corelet-registry), writes the
artifact + `meta.json` / `index.json`, commits a `publish/<id>-<version>`
branch, pushes, and opens a PR via `gh`. A maintainer reviews and merges;
Cloudflare Pages auto-deploys; `corelet install <id>` works within ~30s of
merge.

See `corelet publish --help` for non-PR (`--no-pr`, `--dry-run`) modes.

## Contributing a new app

1. Fork this repo.
2. Add `<id>/<id>.json` + `<id>/<id>.ui.tsx` (run `corelet new <id>` for a
   skeleton).
3. `corelet validate ./<id>/<id>.json` — must pass cleanly.
4. Open PR with the new directory. Once merged, you (or a maintainer) can
   run `corelet publish` against it to land in the binary registry.

## License

Each subdirectory carries its own `manifest.license` field. The repository
itself is MIT.
