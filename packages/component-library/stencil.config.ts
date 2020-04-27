import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { angularOutputTarget, ValueAccessorConfig } from '@stencil/angular-output-target';
import { reactOutputTarget } from '@stencil/react-output-target';
import alias from '@rollup/plugin-alias';
import path from 'path';
import process from 'process';

const DEV_MODE = process.argv.indexOf('--dev') > 0;

const angularValueAccessorBindings: ValueAccessorConfig[] = [
  {
    elementSelectors: ['demo-component'],
    event: 'slideChanged',
    targetAttr: 'value',
    type: 'number',
  },
];

export const config: Config = {
  namespace: 'demo',
  devServer: { reloadStrategy: 'pageReload', openBrowser: false },
  rollupPlugins: {
    before: DEV_MODE
      ? [
          alias({
            entries: [
              {
                find: 'services-library',
                replacement: path.resolve(__dirname, '../services-library/src/services-library'),
              },
            ],
          }),
        ]
      : [],
  },
  plugins: [sass()],
  globalScript: DEV_MODE ? 'src/main-dev.ts' : 'src/main.ts',
  outputTargets: [
    angularOutputTarget({
      componentCorePackage: 'component-library',
      directivesProxyFile: '../component-library-angular/src/directives/proxies.ts',
      valueAccessorConfigs: angularValueAccessorBindings,
    }),
    reactOutputTarget({
      componentCorePackage: 'component-library',
      proxiesFile: '../component-library-react/src/components.ts',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    { type: 'experimental-dist-module', dir: 'dist/module' },
    { type: 'docs-readme' },
    { type: 'docs-json', file: './stuff.json' },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
