# Customer Secret Setup

The platform records required external secrets as setup checklist items. It does not store customer
provider secrets.

## GitHub Actions Secrets

Secrets are added in:

```text
Repository Settings -> Secrets and variables -> Actions -> New repository secret
```

## Deployment

### Alpha-hosted repositories (`workflow-templates/product/`)

**No deploy secrets.** Alpha connects the repository to Render (backends) or Vercel (frontends), and
the platform's own GitHub app deploys each push. Render and Vercel credentials stay on the Alpha
server; nothing is installed into the repository.

Alpha writes these repository **variables** (not secrets; they are public URLs):

- `ALPHA_URL_MAIN`, `ALPHA_URL_UAT`, `ALPHA_URL_DEV`: the stable URL of each hosted environment,
  for workflows that need one without a deployment event. A backend has no `dev` environment.

Hosting environment variables (API keys, database URLs) are set in Alpha's Variables panel. They
are stored by the platform as secrets, never in the repository.

### CI-deployed repositories (`workflow-templates/customer/`)

The deploy job authenticates with repository secrets:

Render:
- `RENDER_DEPLOY_HOOK_URL_DEV`, `RENDER_DEPLOY_HOOK_URL_UAT`, `RENDER_DEPLOY_HOOK_URL_MAIN`
- `RENDER_HEALTHCHECK_URL_DEV`, `RENDER_HEALTHCHECK_URL_UAT`, `RENDER_HEALTHCHECK_URL_MAIN`

Per-branch secrets fall back to `RENDER_DEPLOY_HOOK_URL` / `RENDER_HEALTHCHECK_URL` when the
branch-specific secret is not set.

Vercel:
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## Other secrets

### Auto-promotion

- `GH_PR_TOKEN`: the token promotion workflows use to open or update pull requests. Alpha-hosted
  repositories do not need it; Alpha opens promotion pull requests itself.

### Grafana k6

- `K6_CLOUD_TOKEN`
- `K6_CLOUD_PROJECT_ID`

## Variables

Repository variables are safe for non-secret setup values such as:

- `E2E_BASE_URL`
- `K6_BASE_URL`
- `REQUIRE_PRODUCTION_APPROVAL`

The dashboard should link users directly to the repository's Actions secrets and variables pages.
