# Granular Workflow Templates

These templates are the customer-facing entrypoints for new repositories.

The central repository is organized into three logical areas:

- `workflow-templates/customer/` contains caller templates and their catalog metadata for generated customer repositories.
- `workflow-templates/product/` is reserved for AlphaOrch product-specific caller templates.
- `workflow-templates/legacy/` contains retired provider-specific examples kept only for historical migration reference.

GitHub Actions runtime workflows remain flat under `.github/workflows/`; GitHub does not load reusable workflows from subdirectories.

- Copy the closest `*.yml` file into `.github/workflows/` in the consumer repo.
- Keep ordering in the copied workflow with `needs`.
- Call central reusable workflows directly from `Capstone-Agentic-AI-Orchestration/alphaorch-workflow/.github/workflows/*.yml@v1`.
- There is no subscription/access-gate job. Quality jobs (tests, lint, security, build) run unconditionally on push and pull_request; deploy jobs run only on push to `dev`, `uat`, or `main`, after the quality jobs succeed.
- Backend templates deploy through `render-deploy.yml`; frontend templates deploy through `vercel-deploy.yml`; mobile templates have no deploy job.
- Do not use old long-pipeline caller files for new granular workflows.
- Keep runtime and action versions current. Default Node.js to the current Active LTS release, and update reusable workflow action pins when new stable major versions are released.

Each workflow template has a paired `*.properties.json` file for catalog metadata.

The platform catalog should choose templates through a composed model:

```text
repoShape -> projectTypeId -> workflowRecipeId -> options
```

Workflow templates are renderable recipe targets, not one-off files for every
possible option combination. Project types and workflow recipes should declare
which options they support, and the backend should remove or configure optional
jobs while keeping the quality jobs required ahead of any deploy job.

## Deployment Variables and Secrets

Deploys go through Render (backends) or Vercel (frontends). There are no GCP
project, Workload Identity Federation, or Cloud Run variables to configure.

Render (`render-deploy.yml`), via repository secrets:
- `RENDER_DEPLOY_HOOK_URL_DEV` / `_UAT` / `_MAIN` (or the `RENDER_DEPLOY_HOOK_URL` fallback)
- `RENDER_HEALTHCHECK_URL_DEV` / `_UAT` / `_MAIN` (or the `RENDER_HEALTHCHECK_URL` fallback)

Vercel (`vercel-deploy.yml`), via repository secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Do not add GOOGLE_APPLICATION_CREDENTIALS, service account JSON, or any GCP project/region/Workload Identity Federation variable to generated deployment workflows.
