import * as path from 'path';
import { build } from 'esbuild';
import { lessLoader } from '../src/index';

build({
  entryPoints: [path.resolve(__dirname, 'index.ts')],
  bundle: true,
  outdir: path.resolve(__dirname, 'output'),
  plugins: [
    lessLoader({
      globalVars: {
        primaryColor: '#ff0000',
      },
    }),
  ],
  loader: {
    '.ts': 'ts',
  },
}).catch((e) => console.error(e.message));
