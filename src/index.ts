import * as path from 'path';
import { promises as fs } from 'fs';
import { Plugin } from 'esbuild';
import less from 'less';

const namespace = 'less';

/** Less-loader for esbuild */
export function lessLoader(options: Less.Options = {}): Plugin {
  return {
    name: 'less-loader',
    setup: (build) => {
      // Resolve *.less files with namespace
      build.onResolve({ filter: /\.less$/ }, (args) => {
        return {
          path: path.resolve(process.cwd(), path.relative(process.cwd(), args.resolveDir), args.path),
          namespace,
        };
      });

      // Compilation
      build.onLoad({ filter: /.*/, namespace }, async (args) => {
        const content = await fs.readFile(args.path, 'utf-8');
        const dir = path.dirname(args.path);

        const result = await less.render(content, {
          rootpath: './',
          paths: [...(options.paths || []), dir],
          ...options,
        });

        return {
          contents: result.css,
          loader: 'css',
        };
      });
    },
  };
}
