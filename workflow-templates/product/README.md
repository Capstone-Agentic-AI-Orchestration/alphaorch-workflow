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

The quality jobs are the same as the matching `workflow-templates/customer/*.yml`. When a customer
template's quality jobs change, change these to match. `workflow-validation.yml` asserts the product
callers never reference a deploy workflow or inherit secrets.

Gating production on CI:
- **Render:** Alpha creates services with auto-deploy set to wait for CI checks.
- **Vercel:** turn on **Deployment Checks** for the project and require the `Frontend CI` jobs. Vercel
  then holds a production build until they pass. Vercel offers this in the dashboard only, not through
  its API.
