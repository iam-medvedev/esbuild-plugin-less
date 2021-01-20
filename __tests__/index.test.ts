import * as path from 'path';
import { build } from 'esbuild';
import { lessLoader } from '../src/index';

it('build example', async () => {
  const primaryColor = '#ff0000';

  const { outputFiles } = await build({
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
  });

  expect(outputFiles.length).toStrictEqual(2);

  expect(path.extname(outputFiles[0].path)).toStrictEqual('.js');
  expect(path.extname(outputFiles[1].path)).toStrictEqual('.css');

  const css = outputFiles[1].text;
  expect(css).toMatch(`background:${primaryColor}`);
  expect(css).toMatch(`body article{width:100px}`);
  expect(css).toMatch(`body article:first-child{width:200px}`);
});
