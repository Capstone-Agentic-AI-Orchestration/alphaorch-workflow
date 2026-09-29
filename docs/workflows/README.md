# Workflow Catalog

`Capstone-Agentic-AI-Orchestration/alphaorch-workflow` is the central workflow source of truth.
It is a standalone reusable-workflow library: there is no platform backend behind it, and no
workflow in this repository depends on a platform callback endpoint or token.

The repository has three logical layers:

- Product reusable workflows and actions remain flat under `.github/workflows/`
  and `.github/actions/` because that is what GitHub loads.
- Customer caller templates and catalog metadata live under
  `workflow-templates/customer/`.
- Alpha-hosted callers live under `workflow-templates/product/`: the same quality jobs as the
  customer templates, with no deploy job, for repositories Render or Vercel deploy themselves.
- Retired provider examples live under `workflow-templates/legacy/` and are
  not selectable for new projects.

The platform catalog is composed as:

```text
repoShape -> projectTypeId -> workflowRecipeId -> options
```

Customer catalog files live under `catalog/customer/`:

- `project-types.json` describes supported project types and their local `starter-templates/` paths.
- `workflow-recipes.json` maps project types and recipes to customer templates.

## Reusable workflows

| Workflow | Role | Purpose |
| --- | --- | --- |
| [lint-check.yml](lint-check.md) | quality | Run lint and optional format checks. |
| [frontend-tests.yml](frontend-tests.md) | quality | Run frontend unit tests with coverage. |
| [backend-tests.yml](backend-tests.md) | quality | Run backend unit and optional integration tests with coverage. |
| [dotnet-test.yml](dotnet-test.md) | quality | Build and test a .NET solution, merging per-project coverage before the gate. |
| [dotnet-analyze.yml](dotnet-analyze.md) | quality | Build a .NET solution with analyzers enabled and warnings escalated. |
| [dotnet-format.yml](dotnet-format.md) | quality | Verify C# formatting and style with dotnet format. |
| [dotnet-audit.yml](dotnet-audit.md) | security | Audit NuGet dependencies against known advisories. |
| [sonarcloud-dotnet-scan.yml](sonarcloud-dotnet-scan.md) | quality | Analyse C# with SonarScanner for .NET. |
| [gitleaks-scan.yml](gitleaks-scan.md) | security | Scan for committed secrets with Gitleaks, redacted. |
| [dotnet-license-scan.yml](dotnet-license-scan.md) | governance | Inventory NuGet licences and fail on forbidden terms. |
| [dotnet-sbom.yml](dotnet-sbom.md) | governance | Export a CycloneDX SBOM as the release record. |
| [bruno-api-test.yml](bruno-api-test.md) | verify | Exercise a deployed API with a Bruno collection and fail a run that asserted nothing. |
| [schemathesis-scan.yml](schemathesis-scan.md) | verify | Generate contract tests from the OpenAPI document and fail a run that exercised nothing. |
| [mobile-tests.yml](mobile-tests.md) | quality | Run mobile unit tests with coverage. |
| [security-scan.yml](security-scan.md) | security | Run dependency and source security scans. |
| [docker-build.yml](docker-build.md) | build | Build, optionally push, and scan Docker images. |
| [render-deploy.yml](render-deploy.md) | deploy | Deploy a backend service to Render (deploy hook or health-verify) and probe it. |
| [vercel-deploy.yml](vercel-deploy.md) | deploy | Build and deploy a frontend to Vercel (preview or production). |
| [post-deploy-verify.yml](post-deploy-verify.md) | verify | Check a deployed URL answers 2xx after the hosting platform deployed it. |
| [workflow-validation.yml](workflow-validation.md) | maintenance | Validate workflow shape, contracts, catalogs, and templates. |

## Customer templates

Use the paired YAML and `.properties.json` files under
`workflow-templates/customer/`. Generated callers must pin central references
to `Capstone-Agentic-AI-Orchestration/alphaorch-workflow/...@v1`; they must not use the retired
`v0.1.7-smoke` tag or any legacy organization path.

Alpha reads these templates from this repository at a pinned ref (`ALPHAORCH_WORKFLOW_REF`,
e.g. `v1`) at provisioning time, and points every library call in them at the repository it read
them from. An Alpha-hosted repository gets `workflow-templates/product/<stack>.yml` as its `ci.yml`;
`render-deploy.yml` and `vercel-deploy.yml` remain for repositories that deploy from CI themselves.

## Rules

- Keep GitHub Actions runtime workflows flat under `.github/workflows/`.
- Keep job ordering explicit with `needs`. Where a caller deploys, the deploy job runs only on push to
  `dev`, `uat` or `main`, after the quality jobs succeed. Alpha-hosted callers have no deploy job.
- Keep quality, typecheck, tests, coverage, security, and CodeQL gates required;
  only credential-dependent deployment hooks may be optional.
- Do not add one template per option combination. Add catalog options and let
  the backend render the selected recipe.
