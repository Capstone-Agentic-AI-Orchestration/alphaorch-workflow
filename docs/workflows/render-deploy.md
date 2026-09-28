# render-deploy.yml

## Role
Deployment.

## Purpose
Deploys a service to Render and verifies it, either by triggering a deploy hook or by health-checking
an already-deployed revision.

## Public Contract
- Source workflow: `.github/workflows/render-deploy.yml`
- Inputs: `system-name`, `environment`, `branch`, `deploy-mode`, `deploy-hook-url`, `healthcheck-url`,
  `healthcheck-path`, `healthcheck-timeout-seconds`, `healthcheck-interval-seconds`,
  `healthcheck-expected-statuses`, `require-api-center-check`
- Secrets: `RENDER_DEPLOY_HOOK_URL_DEV`, `RENDER_DEPLOY_HOOK_URL_UAT`, `RENDER_DEPLOY_HOOK_URL_MAIN`,
  `RENDER_DEPLOY_HOOK_URL`, `RENDER_HEALTHCHECK_URL_DEV`, `RENDER_HEALTHCHECK_URL_UAT`,
  `RENDER_HEALTHCHECK_URL_MAIN`, `RENDER_HEALTHCHECK_URL` (all optional; resolved per environment)
- Outputs: `deployment_url`, `mode_used`, `health_status`, `healthcheck_url`, `health_http_code`,
  `webhook_http_code`

## Usage
Emitted by the Render workflow fragment for projects whose backend slot targets Render. `deploy-mode`
accepts `auto`, `webhook`, or `verify-only`. `require-api-center-check` defaults to `false`; only set it
to `true` when the caller's own health endpoint actually returns `checks.apiCenter` — it is not a
generic health field, and no platform backend exists in this repository to supply it.

Render serves the `backend` slot. It coexists with Vercel (`frontend`) — the provider is chosen
per deployment target, not globally.
