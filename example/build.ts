import * as path from 'path';
import { build } from 'esbuild';
import { lessLoader } from '../src/index';

// isProduction flag for watch mode
const isProduction = process.env.NODE_ENV === 'production';
const entryPoints = [path.resolve(__dirname, 'index.ts'), path.resolve(__dirname, 'index.less')];
const entryPoint = process.argv.includes('--less') ? entryPoints[1] : entryPoints[0];

build({
  watch: isProduction
    ? false
    : {
        onRebuild(error) {
          if (!error) {
            console.log('Build succeeded');
          }
        },
      },
  entryPoints: [entryPoint],
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
    '.png': 'base64',
    '.jpg': 'base64',
  },
}).catch((e) => console.error(e.message));
