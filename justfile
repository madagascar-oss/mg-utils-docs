# mg-utils-docs — every command in one place. Run `just` to list them.
set shell := ["bash", "-euo", "pipefail", "-c"]

# List commands
default:
    @just --list

# Fetch the spec and port submodules, install dependencies, browsers and git hooks
setup:
    git submodule update --init
    command -v pnpm >/dev/null || npm install --global pnpm@10
    pnpm install --frozen-lockfile
    pnpm exec playwright install chromium
    pnpm hooks

# Start the dev server on http://localhost:4321/mg-utils-docs/
dev:
    pnpm dev

# Build the static site into dist/
build:
    pnpm build

# Format check, lint, type check and dead-code check
lint:
    pnpm lint

# Fix formatting and auto-fixable lint errors
format:
    pnpm format

# Run the browser tests against a production build
e2e: build
    pnpm test:e2e

# Everything CI runs
ci: lint e2e
