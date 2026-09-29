# Generated Project Contract

Generated repositories are projects provisioned by Alpha. Alpha writes only the files needed to
bootstrap the selected stack and its CI, and records any setup gaps in the dashboard.

## Required Files

An **Alpha-hosted** repository (hosting set up by Alpha on Render or Vercel) gets:

- `.github/workflows/ci.yml`, from `workflow-templates/product/<stack>.yml` (`be-nodejs`,
  `be-nestjs`, `fe-nextjs`, `fe-react`): quality jobs only, no deploy job.
- `.github/workflows/post-deploy-verify.yml`, from `workflow-templates/product/post-deploy-verify.yml`.
- `README.md` with setup instructions, and the stack's starter source.

A **CI-deployed** repository gets the granular customer caller for its stack instead, copied from
`workflow-templates/customer/` (for example `be-nestjs.yml` or `fe-nextjs.yml`), including its deploy
job. It does not get a single `master-pipeline-*.yml` orchestrator, which no longer exists in this
repository.

Optional generated files depend on selected catalog actions:

- `tests/e2e/playwright-e2e.ts`
- `tests/performance/k6-smoke.js`
- stack-specific sanity tests

## Workflow Rules

- Generated workflows must be thin callers.
- Generated workflows must reference the workflow library with a stable release tag such as `@v1`,
  never `@main`. Alpha reads the templates from the repository and ref it is configured with
  (`ALPHAORCH_WORKFLOW_REPO`, `ALPHAORCH_WORKFLOW_REF`) and points every library call at that same
  repository, so a fork calls its own reusable workflows.
- The branch flow is `dev -> uat -> main`, by pull request only.

## Idempotency Rules

Provisioning must be safe to retry:

- If the repository already exists from a previous attempt, continue rather than creating a duplicate.
- If a branch already exists, skip branch creation.
- If a generated file already exists with matching content, skip rewriting it.
- If required provider secrets are missing, record a setup item instead of storing customer provider
  secrets in the platform.

## Managed Marker

Future existing-repo onboarding should include a managed marker in generated files before
overwriting them. Until then, existing-repository onboarding must create a setup branch and a pull
request instead of pushing directly to `main`.
