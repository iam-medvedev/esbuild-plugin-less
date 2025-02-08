# `esbuild-plugin-less`

[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-brightgreen.svg)](http://www.wtfpl.net/about/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-f8bc45.svg)](https://github.com/prettier/prettier)
[![npm version](https://badge.fury.io/js/esbuild-plugin-less.svg)](https://www.npmjs.com/package/esbuild-plugin-less)
[![npm downloads](https://img.shields.io/npm/dt/esbuild-plugin-less.svg)](https://www.npmjs.com/package/esbuild-plugin-less)
[![libraries.io](https://img.shields.io/librariesio/release/npm/esbuild-plugin-less)](https://libraries.io/github/iam-medvedev/esbuild-plugin-less)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fiam-medvedev%2Fesbuild-plugin-less.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fiam-medvedev%2Fesbuild-plugin-less?ref=badge_shield)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[esbuild](https://github.com/evanw/esbuild) plugin for [LESS](https://lesscss.org/) files.

Supports all LESS features, including [imports](https://lesscss.org/#importing), [variables](https://lesscss.org/#variables), [mixins](https://lesscss.org/#mixins), and more.

## Features

- 💫 Support for all LESS.js features and options
- 🎨 CSS Modules support with `.module.less` files
- 🔄 Watch mode support with automatic rebuilds
- 🎯 Custom file filtering options
- 📝 Written in TypeScript

## Installation

```sh
# Using bun
$ bun add -D esbuild-plugin-less

# Using yarn
$ yarn add -D esbuild-plugin-less

# Using pnpm
$ pnpm add -D esbuild-plugin-less

# Using npm
$ npm install --save-dev esbuild-plugin-less
```

## Basic Usage

```ts
import { build } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  plugins: [lessLoader()], // That's it!
  loader: {
    '.ts': 'ts',
  },
});
```

## Advanced Configuration

### With LESS Options

```ts
import { build } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  plugins: [
    lessLoader({
      // LESS.js options
      math: 'always',
      globalVars: {
        primaryColor: '#ff0000',
      },
      paths: ['./src/styles'],
      javascriptEnabled: true,
    }),
  ],
});
```

### With Loader Options

```ts
import { build } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  plugins: [
    lessLoader(
      {}, // LESS options (empty in this example)
      {
        // Loader options
        filter: /\._?less$/, // Custom file filter
        inline: false, // Control if LESS files should be inlined as strings
      },
    ),
  ],
});
```

## CSS Modules Support

The plugin automatically handles `.module.less` files as CSS Modules. This enables local scoping of styles and generates unique class names.

```less
// styles.module.less
.button {
  color: blue;
}
```

```ts
// Component.ts
import styles from './styles.module.less';
element.className = styles.button; // Will use the generated unique class name
```

## Configuration Options

### LESS Options

The plugin accepts all valid options from LESS.js. Here are some commonly used options:

For a complete list of LESS options, see the [LESS documentation](http://lesscss.org/usage/#less-options).

### Loader Options

| Option   | Type      | Default     | Description                                |
| -------- | --------- | ----------- | ------------------------------------------ |
| `filter` | `RegExp`  | `/\.less$/` | Custom filter for processing files         |
| `inline` | `boolean` | `false`     | Import LESS files as strings in TypeScript |

## License

`esbuild-plugin-less` is [WTFPL licensed](./LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fiam-medvedev%2Fesbuild-plugin-less.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fiam-medvedev%2Fesbuild-plugin-less?ref=badge_large)
