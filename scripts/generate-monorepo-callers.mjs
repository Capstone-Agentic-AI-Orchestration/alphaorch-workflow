import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Monorepo callers are derived, not hand-written: each is the matching single-repo
// product caller with prefixed job ids and a default folder. Run after changing a
// product caller; workflow-validation.yml fails when the committed copies differ.
//
//   node scripts/generate-monorepo-callers.mjs
const root = process.argv[2] ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const product = path.join(root, 'workflow-templates', 'product');
const out = path.join(product, 'monorepo');
fs.mkdirSync(out, { recursive: true });

const apps = {
  // React and Node.js only, for now. Another stack is one more entry here, and
  // the matching assertions in workflow-validation.yml.
  web: { role: 'frontend', label: 'Web', dir: 'apps/web', title: 'Frontend', sources: { react: 'fe-react' }, platform: 'Vercel', file: 'ci-web.yml' },
  api: { role: 'backend', label: 'API', dir: 'apps/api', title: 'Backend', sources: { nodejs: 'be-nodejs' }, platform: 'Render', file: 'ci-api.yml' }
};
const stackNames = { react: 'React', nodejs: 'Node.js API' };

for (const [prefix, app] of Object.entries(apps)) {
  for (const [stack, source] of Object.entries(app.sources)) {
    let yaml = fs.readFileSync(path.join(product, source + '.yml'), 'utf8').replace(/\r\n/g, '\n');
    const body = yaml.slice(yaml.indexOf('name: '));
    const header = [
      '# Alpha-hosted monorepo caller for the ' + app.role + ' app in ' + app.dir + '/: the jobs of',
      '# workflow-templates/product/' + source + '.yml with ' + prefix + '- job ids and ' + app.dir + ' as the default folder.',
      '# Alpha writes this to .github/workflows/' + app.file + ' in a monorepo it hosts. The prefixed job ids keep',
      '# this app\'s required checks distinct from the other app\'s. ' + app.platform + ' deploys through its own GitHub app,',
      '# so CI never deploys and needs no deploy secrets.',
      '# Generated from ' + source + '.yml by scripts/generate-monorepo-callers.mjs. Do not edit by hand.',
      '',
      ''
    ].join('\n');
    let next = header + body
      .replace('name: "' + app.title + ' CI"', 'name: "' + app.label + ' CI"')
      .replace(/default: "\."/g, 'default: "' + app.dir + '"')
      .replace(/inputs\.service_path \|\| '\.'/g, "inputs.service_path || '" + app.dir + "'")
      .replace('default: "' + app.role + '"', 'default: "' + prefix + '"')
      .replace(new RegExp("inputs\\.service_name \\|\\| '" + app.role + "'", 'g'), "inputs.service_name || '" + prefix + "'")
      .replace(/^  (unit-tests|lint|security|build|docker):$/gm, '  ' + prefix + '-$1:')
      .replace(/needs: \[unit-tests, lint, security\]/g, 'needs: [' + prefix + '-unit-tests, ' + prefix + '-lint, ' + prefix + '-security]');
    fs.writeFileSync(path.join(out, prefix + '-' + stack + '.yml'), next);

    const props = JSON.parse(fs.readFileSync(path.join(product, source + '.properties.json'), 'utf8'));
    const meta = {
      name: 'Monorepo ' + app.label + ' ' + stackNames[stack] + ' (Alpha-hosted)',
      description: 'The ' + app.role + ' app of an Alpha-hosted monorepo, in ' + app.dir + '/. Same quality jobs as ' + source + '.yml with ' + prefix + '- job ids. CI only: hosting deploys through the ' + app.platform + ' GitHub app.',
      categories: [app.role, stack, 'ci', 'alpha-hosted', 'monorepo'],
      filePatterns: props.filePatterns.map(p => app.dir + '/' + p)
    };
    fs.writeFileSync(path.join(out, prefix + '-' + stack + '.properties.json'), JSON.stringify(meta, null, 4) + '\n');
  }
}
