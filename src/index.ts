import path from 'path';
import { promises as fs } from 'fs';
import { Plugin } from 'esbuild';
import less from 'less';
import { getLessImports } from './less-utils';

/** Less-loader for esbuild */
export function lessLoader(options: Less.Options = {}): Plugin {
  return {
    name: 'less-loader',
    setup: (build) => {
      // Resolve *.less files with namespace
      build.onResolve({ filter: /\.less$/, namespace: 'file' }, (args) => {
        const filePath = path.resolve(process.cwd(), path.relative(process.cwd(), args.resolveDir), args.path);

        return {
          path: filePath,
          watchFiles: !!build.initialOptions.watch ? [filePath, ...getLessImports(filePath)] : undefined,
        };
      });

      // Build .less files
      build.onLoad({ filter: /\.less$/, namespace: 'file' }, async (args) => {
        const content = await fs.readFile(args.path, 'utf-8');
        const dir = path.dirname(args.path);
        const filename = path.basename(args.path);

        const result = await less.render(content, {
          filename,
          rootpath: dir,
          ...options,
          paths: [...(options.paths || []), dir],
        });

        return {
          contents: result.css,
          loader: 'css',
          resolveDir: dir,
        };
      });
    },
  };
}
