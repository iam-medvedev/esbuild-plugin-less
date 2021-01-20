[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-brightgreen.svg)](http://www.wtfpl.net/about/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-f8bc45.svg)](https://github.com/prettier/prettier)
[![npm version](https://badge.fury.io/js/esbuild-plugin-less.svg)](https://www.npmjs.com/package/esbuild-plugin-less)

# esbuild-plugin-less

[esbuild](https://github.com/evanw/esbuild) plugin for less files

## Install

```
yarn add esbuild-plugin-less -D
```

## Usage

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

## Options

`lessLoader` accepts all valid options from less.js. You can find a complete list of options [here](http://lesscss.org/usage/#less-options).
