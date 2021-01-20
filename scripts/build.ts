import { build, Format } from 'esbuild';
import * as path from 'path';

const formats: Format[] = ['cjs', 'esm'];

const createBuild = () => {
  formats.map((format) => {
    build({
      entryPoints: [path.resolve(__dirname, '..', 'src', 'index.ts')],
      bundle: true,
      minify: true,
      platform: 'node',
      loader: {
        '.ts': 'ts',
      },
      external: ['less', 'path', 'fs'],
      outfile: path.resolve(__dirname, '..', 'build', `${format}.js`),
      format,
    })
      .then(() => {
        console.info(`${format}.js was built`);
      })
      .catch((e) => {
        console.info(`🚨 ${format}.js build error:`);
        console.error(e);
      });
  });
};

createBuild();
