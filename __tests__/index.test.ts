import * as path from 'path';
import { build, BuildOptions, PluginBuild } from 'esbuild';
import { lessLoader, LoaderOptions } from '../src/index';

const buildLess = async ({ lessOptions }: { lessOptions?: Less.Options } = {}) => {
  const buildOptions: BuildOptions = {
    entryPoints: [path.resolve(__dirname, '../', 'example', 'index.ts')],
    bundle: true,
    write: false,
    minify: true,
    outdir: path.resolve(__dirname, 'output'),
    loader: {
      '.ts': 'ts',
    },
    plugins: [lessLoader(lessOptions)],
  };

  const { outputFiles } = await build(buildOptions);
  return outputFiles;
};

const buildLessWithOption = async ({
  lessOptions,
  loaderOptions,
}: { lessOptions?: Less.Options; loaderOptions?: LoaderOptions } = {}) => {
  const buildOptions: BuildOptions = {
    entryPoints: [path.resolve(__dirname, '../', 'example', 'index-custom-filter.ts')],
    bundle: true,
    write: false,
    minify: true,
    outdir: path.resolve(__dirname, 'output'),
    loader: {
      '.ts': 'ts',
    },
    plugins: [lessLoader(lessOptions, loaderOptions)],
  };

  const { outputFiles } = await build(buildOptions);
  return outputFiles;
};

describe('less-loader', () => {
  it('exported module', () => {
    expect(lessLoader).toBeDefined();
  });

  it('onResolve with watch mode', () => {
    const plugin = lessLoader();

    let onResolveCallback = null;
    const build = {
      initialOptions: {
        watch: true,
      },
      onResolve: (opts, callback) => {
        onResolveCallback = callback;
      },
      onStart: jest.fn(),
      onEnd: jest.fn(),
      onLoad: jest.fn(),
    } as unknown as PluginBuild;

    plugin.setup(build);

    const path = '/path';
    const onResolveResult = onResolveCallback({ resolveDir: '/', path });

    expect(onResolveResult).toMatchObject({
      path,
      watchFiles: [path],
    });
  });

  it('builds successful', async () => {
    const primaryColor = '#ff0000';
    const result = await buildLess({
      lessOptions: {
        globalVars: {
          primaryColor,
        },
      },
    });

    expect(result.length).toStrictEqual(2);

    expect(path.extname(result[0].path)).toStrictEqual('.js');
    expect(path.extname(result[1].path)).toStrictEqual('.css');

    // Result has compiled .less
    const css = result[1].text;
    expect(css).toMatch(`background:${primaryColor}`);
    expect(css).toMatch(`body article{width:100px}`);
    expect(css).toMatch(`body article:first-child{width:200px}`);
  });

  it('builds successful custom filter', async () => {
    const primaryColor = '#ff0000';
    const result = await buildLessWithOption({
      lessOptions: {
        globalVars: {
          primaryColor,
        },
      },
      loaderOptions: {
        filter: /\._?less_?$/,
      },
    });

    expect(result.length).toStrictEqual(2);

    expect(path.extname(result[0].path)).toStrictEqual('.js');
    expect(path.extname(result[1].path)).toStrictEqual('.css');

    // Result has compiled .less
    const css = result[1].text;
    expect(css).toMatch(`background:${primaryColor}`);
    expect(css).toMatch(`body article{width:100px}`);
    expect(css).toMatch(`body article:first-child{width:200px}`);
  });

  it('builds imported .less files', async () => {
    const result = await buildLess({
      lessOptions: {
        globalVars: {
          primaryColor: '#ff0000',
        },
      },
    });

    const css = result[1].text;

    expect(css).toMatch(`.style-2-less`);
    expect(css).toMatch(`.style-3-less`);
  });

  it('builds imported ._less_ files', async () => {
    const result = await buildLessWithOption({
      lessOptions: {
        globalVars: {
          primaryColor: '#ff0000',
        },
      },
      loaderOptions: {
        filter: /\._?less_?$/,
      },
    });

    const css = result[1].text;

    expect(css).toMatch(`.style-2-less`);
    expect(css).toMatch(`.style-3-less`);
  });

  it('builds imported .css files', async () => {
    const result = await buildLess({
      lessOptions: {
        globalVars: {
          primaryColor: '#ff0000',
        },
      },
    });

    const css = result[1].text;
    expect(css).toMatch(`#style-4-css`);
    expect(css).toMatch(`#style-5-css`);
  });

  it('catches less error', async () => {
    await expect(
      buildLess({
        lessOptions: {
          globalVars: {},
        },
      }),
    ).rejects.toThrow();
  });
});
