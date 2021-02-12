import * as path from 'path';
import { build, BuildOptions } from 'esbuild';
import { lessLoader } from '../src/index';

const primaryColor = '#ff0000';
const buildOptions: BuildOptions = {
  entryPoints: [path.resolve(__dirname, '../', 'example', 'index.ts')],
  bundle: true,
  write: false,
  minify: true,
  outdir: path.resolve(__dirname, 'output'),
  loader: {
    '.ts': 'ts',
  },
  plugins: [
    lessLoader({
      globalVars: {
        primaryColor,
      },
    }),
  ],
};

it('build example', async () => {
  const { outputFiles } = await build(buildOptions);

  expect(outputFiles.length).toStrictEqual(2);

  expect(path.extname(outputFiles[0].path)).toStrictEqual('.js');
  expect(path.extname(outputFiles[1].path)).toStrictEqual('.css');

  const css = outputFiles[1].text;

  // Result has compiled less
  expect(css).toMatch(`background:${primaryColor}`);
  expect(css).toMatch(`body article{width:100px}`);
  expect(css).toMatch(`body article:first-child{width:200px}`);

  // Result has imported less files
  expect(css).toMatch(`.included-style-2`);
  expect(css).toMatch(`.included-style-3`);
});
