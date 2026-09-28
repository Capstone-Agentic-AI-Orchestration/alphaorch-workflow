# Customer Secret Setup

The MVP records required external secrets as setup checklist items. It should not store customer provider secrets directly.

## GitHub Actions Secrets

Customers add secrets in:

```text
Repository Settings -> Secrets and variables -> Actions -> New repository secret
```

## Deployment Secrets

Deploys go through Render (backends) or Vercel (frontends). Neither provider requires
GCP-style Workload Identity Federation setup; both authenticate with a stored secret.

### Render

- `RENDER_DEPLOY_HOOK_URL_DEV`
- `RENDER_DEPLOY_HOOK_URL_UAT`
- `RENDER_DEPLOY_HOOK_URL_MAIN`
- `RENDER_HEALTHCHECK_URL_DEV`
- `RENDER_HEALTHCHECK_URL_UAT`
- `RENDER_HEALTHCHECK_URL_MAIN`

Per-branch secrets fall back to `RENDER_DEPLOY_HOOK_URL` / `RENDER_HEALTHCHECK_URL` when the
branch-specific secret is not set.

### Vercel

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Auto-promotion

- `GH_PR_TOKEN`: token used by promotion workflows to open or update pull requests.

### Grafana k6

- `K6_CLOUD_TOKEN`
- `K6_CLOUD_PROJECT_ID`

## Variables

Repository variables are safe for non-secret setup values such as:

- `E2E_BASE_URL`
- `K6_BASE_URL`
- `REQUIRE_PRODUCTION_APPROVAL`

There are no GCP project, region, Workload Identity Federation, or Cloud Run variables to
configure; deployment targets are addressed entirely through the Render/Vercel secrets above.

The dashboard should link users directly to the generated repository's Actions secrets and variables pages.
