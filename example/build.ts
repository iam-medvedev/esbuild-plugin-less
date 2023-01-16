import * as path from 'path';
import esbuild, { BuildOptions } from 'esbuild';
import { lessLoader } from '../src/index';

// isProduction flag for watch mode
const isProduction = process.env.NODE_ENV === 'production';
const entryPoints = [path.resolve(__dirname, 'index.ts'), path.resolve(__dirname, 'index.less')];
const entryPoint = process.argv.includes('--less') ? entryPoints[1] : entryPoints[0];

(async () => {
  const buildOptions: BuildOptions = {
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
  };

  if (isProduction) {
    await esbuild.build(buildOptions);
  } else {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
  }
  console.log('Done');
})();
