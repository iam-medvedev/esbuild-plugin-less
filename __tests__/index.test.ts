import * as path from 'path';
import { build, BuildOptions, OutputFile } from 'esbuild';
import { lessLoader } from '../src/index';

let result: OutputFile[] = [];

const primaryColor = '#ff0000';

beforeAll(async () => {
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

  const { outputFiles } = await build(buildOptions);
  result = outputFiles;
});

describe('less-loader', () => {
  it('build is successful', () => {
    expect(result.length).toStrictEqual(2);

    expect(path.extname(result[0].path)).toStrictEqual('.js');
    expect(path.extname(result[1].path)).toStrictEqual('.css');

    // Result has compiled .less
    const css = result[1].text;
    expect(css).toMatch(`background:${primaryColor}`);
    expect(css).toMatch(`body article{width:100px}`);
    expect(css).toMatch(`body article:first-child{width:200px}`);
  });

  it('build imported .less files', () => {
    const css = result[1].text;

    expect(css).toMatch(`.style-2-less`);
    expect(css).toMatch(`.style-3-less`);
  });

  it('build imported .css files', () => {
    const css = result[1].text;
    expect(css).toMatch(`#style-4-css`);
    expect(css).toMatch(`#style-5-css`);
  });
});
