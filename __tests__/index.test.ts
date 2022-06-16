import * as path from 'path';
import { build, BuildOptions, PluginBuild } from 'esbuild';
import { lessLoader, LoaderOptions } from '../src/index';

const entryPoints = [
  path.resolve(__dirname, '../', 'example', 'index.ts'),
  path.resolve(__dirname, '../', 'example', 'index-custom-filter.ts'),
  path.resolve(__dirname, '../', 'example', 'index.less'),
];

const commonOptions: BuildOptions = {
  bundle: true,
  write: false,
  minify: true,
  outdir: path.resolve(__dirname, 'output'),
  loader: {
    '.ts': 'ts',
    '.png': 'dataurl',
    '.jpg': 'dataurl',
  },
};

const buildLess = async ({
  lessOptions,
  loaderOptions,
  entryPoint = entryPoints[0],
}: { lessOptions?: Less.Options; loaderOptions?: LoaderOptions; entryPoint?: string } = {}) => {
  const buildOptions: BuildOptions = {
    ...commonOptions,
    entryPoints: [entryPoint],
    plugins: [lessLoader(lessOptions, loaderOptions)],
  };

  const { outputFiles } = await build(buildOptions);
  return outputFiles;
};

describe('less-loader', () => {
  it('exported module', () => {
    expect(lessLoader).toBeDefined();
  });

  it('onResolve with watch mode', async () => {
    const plugin = lessLoader();

    let onResolveCallback: null | Function = null;
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

    await plugin.setup(build);

    const path = '/path';
    const onResolveResult = onResolveCallback !== null && (onResolveCallback as Function)({ resolveDir: '/', path });

    expect(onResolveResult).toMatchSnapshot();
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

    // Result has compiled .less
    expect(result![1].text).toMatchSnapshot();
  });

  it('builds successful custom filter', async () => {
    const primaryColor = '#ff0000';
    const result = await buildLess({
      lessOptions: {
        globalVars: {
          primaryColor,
        },
      },
      loaderOptions: {
        filter: /\._?less_?$/,
      },
      entryPoint: entryPoints[1],
    });

    // Result has compiled .less
    expect(result![1].text).toMatchSnapshot();
  });

  it('builds successful with less as entrypoint', async () => {
    const primaryColor = '#ff0000';
    const result = await buildLess({
      lessOptions: {
        globalVars: {
          primaryColor,
        },
      },
      entryPoint: entryPoints[2],
    });

    // Result has compiled .less
    expect(result![0].text).toMatchSnapshot();
  });

  it('builds imported .less files', async () => {
    const result = await buildLess({
      lessOptions: {
        globalVars: {
          primaryColor: '#ff0000',
        },
      },
    });

    expect(result![1].text).toMatchSnapshot();
  });

  it('builds imported ._less_ files', async () => {
    const result = await buildLess({
      lessOptions: {
        globalVars: {
          primaryColor: '#ff0000',
        },
      },
      loaderOptions: {
        filter: /\._?less_?$/,
      },
      entryPoint: entryPoints[1],
    });

    expect(result![1].text).toMatchSnapshot();
  });

  it('builds imported .css files', async () => {
    const result = await buildLess({
      lessOptions: {
        globalVars: {
          primaryColor: '#ff0000',
        },
      },
    });

    expect(result![1].text).toMatchSnapshot();
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
