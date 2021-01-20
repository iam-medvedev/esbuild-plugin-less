import * as path from 'path';
import { build } from 'esbuild';
import { lessLoader } from '../src/index';

it('build example', async () => {
  const { outputFiles } = await build({
    entryPoints: [path.resolve(__dirname, '../', 'example', 'index.ts')],
    bundle: true,
    write: false,
    outdir: path.resolve(__dirname, 'output'),
    plugins: [lessLoader()],
    loader: {
      '.ts': 'ts',
    },
  });

  expect(outputFiles.length).toStrictEqual(2);

  expect(path.extname(outputFiles[0].path)).toStrictEqual('.js');
  expect(path.extname(outputFiles[1].path)).toStrictEqual('.css');
});

it.todo('less options');
