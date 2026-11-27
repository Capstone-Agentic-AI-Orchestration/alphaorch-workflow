# Product Workflow Templates

Callers for AlphaOrch's own product: the workflows Alpha writes into repositories it provisions
**and hosts**. They are kept apart from the customer templates, so a change to how Alpha delivers
does not alter the catalog generated for customers.

Alpha hosts a backend on Render and a frontend on Vercel through each platform's own GitHub app, so
the platform deploys on every push. CI never deploys and needs no deploy secrets.

| Template | Written to | What it does |
| --- | --- | --- |
| `be-nodejs.yml`, `be-nestjs.yml` | `.github/workflows/ci.yml` | Unit tests with coverage, lint, security scan, optional Docker build. No deploy job. |
| `fe-nextjs.yml`, `fe-react.yml` | `.github/workflows/ci.yml` | Unit tests with coverage, lint, security scan, production build. No deploy job. |
| `post-deploy-verify.yml` | `.github/workflows/post-deploy-verify.yml` | Runs on `deployment_status` (Vercel reports every deploy) or by hand, and checks the deployed URL answers. |
| `monorepo/api-nodejs.yml` | `.github/workflows/ci-api.yml` | The Node.js backend caller for a monorepo's `apps/api`, as **API CI**. |
| `monorepo/web-react.yml` | `.github/workflows/ci-web.yml` | The React frontend caller for a monorepo's `apps/web`, as **Web CI**. |

The quality jobs are the same as the matching `workflow-templates/customer/*.yml`. When a customer
template's quality jobs change, change these to match. `workflow-validation.yml` asserts the product
callers never reference a deploy workflow or inherit secrets.

## Monorepos

An Alpha monorepo holds a React frontend in `apps/web` and a Node.js backend in `apps/api`, each with its own
`package.json` and lockfile. It gets one caller per app. They are the single-repo callers above with
two changes: the default folder is the app's, and every job id carries a `web-` or `api-` prefix.
Without the prefix both apps would report `lint / Lint & Style Check`, and branch protection, which
matches checks by name, could not require each app's checks separately.

The monorepo callers are generated, for React and Node.js only for now. After changing `fe-react.yml` or
`be-nodejs.yml`, run
`node scripts/generate-monorepo-callers.mjs` and commit the result; `workflow-validation.yml` fails
when they differ. Neither caller filters on `paths:`: a workflow that does not run never reports its
required checks, which would block every pull request that touches only the other app.

Gating production on CI:
- **Render:** Alpha creates services with auto-deploy set to wait for CI checks.
- **Vercel:** turn on **Deployment Checks** for the project and require the `Frontend CI` jobs. Vercel
  then holds a production build until they pass. Vercel offers this in the dashboard only, not through
  its API.
