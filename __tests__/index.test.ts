import { describe, expect, it } from 'vitest';
import * as path from 'path';
import { build, BuildOptions } from 'esbuild';
import { lessLoader, LoaderOptions } from '../src/index';

const entryPoints = [
  path.resolve(__dirname, '../', 'example', 'index.ts'),
  path.resolve(__dirname, '../', 'example', 'index-custom-filter.ts'),
  path.resolve(__dirname, '../', 'example', 'index.less'),
  path.resolve(__dirname, '../', 'example', 'test.module.ts'),
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

type BuildLessProps = {
  lessOptions?: Less.Options;
  loaderOptions?: LoaderOptions;
  entryPoint?: string;
  buildOptions?: BuildOptions;
};

async function buildLess({
  lessOptions,
  loaderOptions,
  entryPoint = entryPoints[0],
  buildOptions: _buildOptions = {},
}: BuildLessProps = {}) {
  const buildOptions: BuildOptions = {
    ...commonOptions,
    entryPoints: [entryPoint],
    plugins: [lessLoader(lessOptions, loaderOptions)],
    ..._buildOptions,
  };

  const { outputFiles } = await build(buildOptions);
  return outputFiles;
}

describe('less-loader', () => {
  it('exported module', () => {
    expect(lessLoader).toBeDefined();
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

  it('works with module.less', async () => {
    const result = await buildLess({
      entryPoint: entryPoints[3],
      buildOptions: {
        format: 'iife',
      },
    });

    expect(result!.length).toEqual(2);

    // Result has compiled .less
    expect(result![1].text).toMatchSnapshot();
  });
});
