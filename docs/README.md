# Central Workflow Template Setup Docs

This folder documents how to set up each template with the central reusable pipelines.

Scope covered:
- Product-specific caller templates used by AlphaOrch itself
- Customer caller templates generated into new repositories
- Legacy provider examples retained only for migration history

The source of truth is `Capstone-Agentic-AI-Orchestration/alphaorch-workflow`. Generated customer
workflows must reference `Capstone-Agentic-AI-Orchestration/alphaorch-workflow/.github/workflows/*@v1`.

This repository has no platform backend of its own: it is a standalone reusable-workflow
library consumed directly by generated caller workflows. Repositories deploy one of two ways:

- **Alpha-hosted** (`workflow-templates/product/`): Alpha connects the repository to Render
  (backends) or Vercel (frontends), and the platform's own GitHub app deploys every push. CI
  runs the quality jobs only and holds no deploy secret. `post-deploy-verify.yml` checks what
  was deployed.
- **CI-deployed** (`workflow-templates/customer/`): the caller deploys through `render-deploy.yml`
  or `vercel-deploy.yml`, driven by repository secrets on the consuming repo.

Validate on `dev` and `uat` first; `main` is the only branch that deploys to production, and
rollback is by restoring a previously verified revision on the target host (Render/Vercel), not
by reverting this repository.

## Canonical Repository Variable Names

Use these canonical names when configuring repositories:
- `FE_SINGLE_SYSTEMS_JSON`
- `FE_MULTI_SYSTEMS_JSON`
- `BACKEND_SINGLE_SYSTEMS_JSON`
- `BACKEND_MULTI_SYSTEMS_JSON`
- `MOBILE_SINGLE_SYSTEMS_JSON`
- `MOBILE_MULTI_SYSTEMS_JSON`

## Document Index

Central caller templates:
- [stack-onboarding-templates.md](stack-onboarding-templates.md) — the current, supported
  granular `workflow-templates/customer/*.yml` caller pattern.

Advanced setup:
- [mobile-release-signing-advanced.md](mobile-release-signing-advanced.md)

## Provider Source Paths for Generic Templates

Use these source paths to obtain credentials:

Vercel:
- Token: Vercel Dashboard -> Settings -> Tokens
- Org ID: Team Settings -> General -> Team ID
- Project ID: Project Settings -> General -> Project ID

SonarCloud:
- Token: My Account -> Security -> Generate Token
- Organization key: Organization Settings
- Project key: Project Information / Project Settings

Grafana Cloud k6:
- Cloud token: k6 Cloud -> Project Settings -> API tokens
- Project ID: k6 Cloud project details page

GitHub PAT (`GH_PR_TOKEN`):
- GitHub -> Settings -> Developer settings -> Personal access tokens
- Minimum recommended scopes:
  - Fine-grained: Contents (read/write), Pull requests (read/write), Metadata (read)
  - Classic PAT fallback: `repo`

Supabase:
- URL + keys: Project Settings -> API
- `SUPABASE_SERVICE_ROLE_KEY` is high sensitivity and must stay in secrets manager only

Internal API Center:
- `API_CENTER_BASE_URL` and `API_CENTER_API_KEY` are organization-managed values
- Obtain from platform owners / API Center admin

## Branch Policy Baseline

All template callers are designed for:
- `dev`
- `uat`
- `main` (production)

Promotion intent is linear, by pull request only:
- `dev` -> `uat` -> `main`

## Notes

- Current workflow refs are documented exactly as observed at verification time.
- Canonical variable names are enforced in this docs set, even if some template READMEs still show older naming.
- Repositories without workflow files should follow [stack-onboarding-templates.md](stack-onboarding-templates.md) for first-time caller onboarding via the granular `workflow-templates/customer/*.yml` pattern.
