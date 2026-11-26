# mdg-utils-docs

Documentation and playground for [mdg-utils](https://github.com/mdgascar/mdg-utils-spec):
Malagasy number words, Madagascar phone numbers, Ariary amounts and dates, the same in every
language.

**Live site:** <https://mdgascar.github.io/mdg-utils-docs/>

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), styled with
Tailwind CSS, in English and French.

## Repository layout

```text
src/content/docs/   pages: English at the root, fr/ for French
src/components/     Header, PageTitle and Footer overrides, page components
src/config/         sidebar, site facts
src/i18n/           UI strings outside Starlight's own
spec/               mdg-utils-spec, git submodule (rules, Public API tables, vectors)
ports/js/           mdg-utils-js, git submodule
ports/php/          mdg-utils-php, git submodule
tests/e2e/          Playwright browser tests
```

## Develop

```sh
git clone --recurse-submodules https://github.com/mdgascar/mdg-utils-docs.git
cd mdg-utils-docs
just setup
just dev   # http://localhost:4321/mdg-utils-docs/
```

Needs Node.js 22.18+, pnpm and [just](https://just.systems). See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
