# mg-utils-docs

Documentation and playground for [mg-utils](https://github.com/madagascar-oss/mg-utils-spec):
Malagasy number words, Madagascar phone numbers, Ariary amounts and dates, the same in every
language.

**Live site:** <https://madagascar-oss.github.io/mg-utils-docs/>

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), styled with
Tailwind CSS, in English, Malagasy and French.

## Repository layout

```text
src/content/docs/   pages: English at the root, mg/ and fr/ for translations
src/components/     Header, PageTitle and Footer overrides, page components
src/config/         sidebar, site facts
src/i18n/           UI strings outside Starlight's own
spec/               mg-utils-spec, git submodule (rules, Public API tables, vectors)
ports/js/           mg-utils-js, git submodule
ports/php/          mg-utils-php, git submodule
tests/e2e/          Playwright browser tests
```

## Develop

```sh
git clone --recurse-submodules https://github.com/madagascar-oss/mg-utils-docs.git
cd mg-utils-docs
just setup
just dev   # http://localhost:4321/mg-utils-docs/
```

Needs Node.js 22.18+, pnpm and [just](https://just.systems). See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
