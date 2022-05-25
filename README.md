[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-brightgreen.svg)](http://www.wtfpl.net/about/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-f8bc45.svg)](https://github.com/prettier/prettier)
[![npm version](https://badge.fury.io/js/esbuild-plugin-less.svg)](https://www.npmjs.com/package/esbuild-plugin-less)
[![libraries.io](https://img.shields.io/librariesio/release/npm/esbuild-plugin-less)](https://libraries.io/github/iam-medvedev/esbuild-plugin-less)
[![Codecov](https://img.shields.io/codecov/c/github/iam-medvedev/esbuild-plugin-less)](https://codecov.io/gh/iam-medvedev/esbuild-plugin-less)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fiam-medvedev%2Fesbuild-plugin-less.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fiam-medvedev%2Fesbuild-plugin-less?ref=badge_shield)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# esbuild-plugin-less

[esbuild](https://github.com/evanw/esbuild) plugin for less files

## Install

```
yarn add esbuild-plugin-less -D
```

## Usage

### Simple example

You can see the example [here](./example).

```ts
import { build } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';

build({
  entryPoints: [path.resolve(__dirname, 'index.ts')],
  bundle: true,
  outdir: path.resolve(__dirname, 'output'),
  plugins: [lessLoader()],
  loader: {
    '.ts': 'ts',
  },
});
```

### Watch mode

More information about watch mode [here](https://esbuild.github.io/api/#watch).

```ts
import { build } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';

build({
  watch: true, // enable watch mode
  entryPoints: [path.resolve(__dirname, 'index.ts')],
  bundle: true,
  outdir: path.resolve(__dirname, 'output'),
  plugins: [lessLoader()],
  loader: {
    '.ts': 'ts',
  },
});
```

## Options

`lessLoader` accepts all valid options from less.js. You can find a complete list of options [here](http://lesscss.org/usage/#less-options).

`LoaderOptions` loader options, support custom [filter](https://esbuild.github.io/plugins/#filters)
```
{
  filter: /\.less$/,
}
```


## License

`esbuild-plugin-less` is [WTFPL licensed](./LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fiam-medvedev%2Fesbuild-plugin-less.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fiam-medvedev%2Fesbuild-plugin-less?ref=badge_large)
