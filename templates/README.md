# Templates

This folder contains reusable starter templates used by customer repositories.

The `master-pipeline-*.yml`-orchestrator caller templates that used to live here
(`be-pipeline-caller.yml`, `fe-pipeline-caller.yml`, `mobile-pipeline-caller.yml`,
`mobile-kotlin-caller.yml`) have been removed: they called reusable workflows that do not exist
in `.github/workflows/`. The currently supported caller shape is the granular
`workflow-templates/customer/*.yml` pattern — see `docs/stack-onboarding-templates.md`.

## Generated Test Templates

- `k6-smoke-template.ts`: k6 smoke-test template referenced by generated k6 performance checks
  (`testing.k6` catalog action). Auto-adjusts expected HTTP statuses for Vercel preview URLs.
- `playwright-e2e-template.ts`: Playwright E2E template referenced by generated E2E checks
  (`testing.playwright` catalog action).

## Replit Nix Template

File: `replit.nix`

Purpose:

- Standardize Replit runtime dependencies across repositories.
- Keep runtime selection explicit and easy to customize.

Usage:

1. Copy `templates/replit.nix` into your repository root as `replit.nix`.
2. Set `runtime` to your baseline runtime package.
3. Add optional tools in `extraDeps` when needed.
4. Keep the selected runtime aligned with your Docker/CI defaults unless intentional.

Example customizations:

- Node 20: set `runtime = pkgs.nodejs_20;`
- Node 22 + OpenSSL: keep `runtime = pkgs.nodejs_22;` and add `pkgs.openssl` to `extraDeps`.
