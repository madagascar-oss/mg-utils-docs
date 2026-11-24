# Contributing to mg-utils-docs

The [organisation guide](https://github.com/madagascar-oss/.github/blob/main/CONTRIBUTING.md)
and [Code of Conduct](https://github.com/madagascar-oss/.github/blob/main/CODE_OF_CONDUCT.md)
apply too.

## What goes where

- **Behaviour, data and function names** are decided in
  [mg-utils-spec](https://github.com/madagascar-oss/mg-utils-spec). This site explains them.
- **Pages** live in `src/content/docs/`: English at the root, `mg/` and `fr/` for translations.
  A page missing in a language falls back to English with a notice, so English comes first.
- **Translations** of Malagasy and French text are welcome from native speakers; drafts are
  marked in the tracking issue.

## Branches and releases

Branch from `dev` as `<type>/<short-name>`, open the PR against `dev`; PRs are squash-merged
with a Conventional Commit title. `main` is the live site: merging `dev` into `main` deploys it.

## Commands

| Command      | Does                                                       |
| ------------ | ---------------------------------------------------------- |
| `just setup` | Fetch submodules, install dependencies, browsers and hooks |
| `just dev`   | Dev server on <http://localhost:4321/mg-utils-docs/>       |
| `just lint`  | Prettier, ESLint, `astro check`, knip                      |
| `just e2e`   | Build, then run the Playwright browser tests               |
| `just ci`    | Everything CI runs                                         |
