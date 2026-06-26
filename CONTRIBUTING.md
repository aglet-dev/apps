# Contributing

`aglet-apps` holds the built-in apps for [Aglet](https://aglet.dev). Each app is a
directory:

```
<app>/
  aglet.json            # manifest (id, permissions, collections, jobs[], …)
  ui.tsx                # declarative view (compiles to canonical IR)
  scripts.js            # optional QuickJS logic (handlers, jobs)
  locales/{en,zh,ja}.json
  tests/*.test.json     # scenario tests
```

## Workflow

1. Fork + branch.
2. `aglet dev <app>` to develop with hot reload; `aglet build <app>` to validate.
3. Keep i18n (en / zh / ja) complete and add at least one scenario test.
4. Open a PR — CI runs `aglet build` (validate) + `aglet test` on changed apps.
5. Publish: tag `<id>-v<version>` → the publish workflow opens a PR to
   [`aglet-registry`](https://github.com/aglet-dev/registry).

## Authoring reference

Components, manifest fields, and the `jobs[]` scheduling model are documented in the
host repo ([`aglet-dev/aglet`](https://github.com/aglet-dev/aglet), `AGENTS.md`).

## License

By contributing you agree your contribution is licensed under MIT.
