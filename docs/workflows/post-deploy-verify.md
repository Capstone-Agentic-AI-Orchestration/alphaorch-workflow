# post-deploy-verify.yml

## Role
Verify.

## Purpose
Checks that a deployed environment answers with a 2xx after the hosting platform deployed it. It is
for repositories whose hosting deploys through the platform's own GitHub app (Alpha-hosted Render
and Vercel), where CI never deploys and so cannot check what it shipped.

## Public Contract
- Source workflow: `.github/workflows/post-deploy-verify.yml`
- Inputs: `base-url` (required, https), `health-path`, `timeout-seconds` (default 180),
  `interval-seconds` (default 10), `environment-name`
- Secrets: none
- Outputs: `status` (the last HTTP status, `000` when nothing answered)

## Usage
Called by `workflow-templates/product/post-deploy-verify.yml` on GitHub's `deployment_status` event,
with `base-url` set to `github.event.deployment_status.environment_url`. That is the URL of the exact
deployment that just went live, so no URL is stored and no secret is needed.

- Vercel's GitHub app records a GitHub deployment for every preview and production deploy, so
  frontends are verified automatically.
- Render's GitHub integration is not documented to record GitHub deployments. A backend is checked by
  running the caller by hand (`workflow_dispatch`, with its URL), or from Alpha's own health check.

Redirects are not followed: a health endpoint that redirects is not healthy. The timeout is long
enough for a sleeping free-tier service to wake.
