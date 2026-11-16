/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'Proibir estritamente dependências cíclicas entre módulos.',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'components-cannot-import-pages',
      severity: 'error',
      comment:
        'Componentes visuais reutilizáveis (src/components/**) não podem importar páginas (src/pages/**).',
      from: {
        path: '(^frontend-[^/]+/src/components)',
      },
      to: {
        path: '(^frontend-[^/]+/src/pages)',
      },
    },
    {
      name: 'no-cross-mfe-internal-import',
      severity: 'error',
      comment:
        'Proibir importações diretas relativas entre diferentes micro-frontends sem passar pelo Module Federation.',
      from: {
        path: '^(frontend-shell|frontend-customers|frontend-products)/src',
      },
      to: {
        path: '^(frontend-shell|frontend-customers|frontend-products)/src',
        pathNot: '^$1',
      },
    },
    {
      name: 'mfe-only-consume-services-pointing-to-gateway',
      severity: 'error',
      comment:
        'Pages e Components devem consumir dados apenas via camada de serviços (src/services).',
      from: {
        path: '^frontend-[^/]+/src/(pages|components)',
      },
      to: {
        path: '^frontend-[^/]+/src/(domain|infrastructure|backend)',
      },
    },
    {
      name: 'not-to-unresolvable',
      severity: 'error',
      comment:
        'Não permitir dependências não resolvidas, exceto os remotes federados em runtime.',
      from: {},
      to: {
        couldNotResolve: true,
        pathNot: [
          '^customers/.*',
          '^products/.*',
          '^frontendCustomers/.*',
          '^frontendProducts/.*',
          '^shell/.*',
        ],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: './frontend-shell/tsconfig.app.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      extensions: ['.ts', '.tsx', '.d.ts', '.js', '.jsx', '.json'],
    },
  },
};
