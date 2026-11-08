# stack-self-test.yml

## Role
Maintenance.

## Purpose
Runs the reusable unit-test, lint, audit, license, and build workflows against real projects whenever the library changes, so a broken quality path fails before `main` moves the floating `v1` tag.

## Public Contract
- Source workflow: `.github/workflows/stack-self-test.yml`
- Inputs: none
- Secrets: none
- Outputs: none

## Usage
Runs inside `alphaorch-workflow` on pull requests that touch workflows, actions, fixtures, or starters, and by hand. It is not a consumer workflow template.

## Fixtures

- `tests/fixtures/alpha-scaffold/{nodejs,nestjs,nextjs,react}`: the projects Alpha's scaffold creates, with no lockfile, as a new repository starts. Regenerate them from `alpha-be-main`'s `buildProjectScaffold` when the scaffold changes.
- `tests/fixtures/dotnet`: a minimal C# solution with an xUnit test project.
- `starter-templates/nodejs-api`: runs the customer Node.js service pipeline end to end.

## Checks

- Unit tests with the coverage gate, lint, and dependency audit for every Alpha stack, plus the frontend production build.
- .NET unit tests with coverage, format, analyzers, NuGet audit, and license scan.
- Customer discovery finds every scaffold and its coverage command.
- The customer Node.js service pipeline starts with the permissions its template grants and passes its quality jobs.
