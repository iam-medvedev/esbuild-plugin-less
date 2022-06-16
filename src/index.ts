import path from 'path';
import { promises as fs } from 'fs';
import { Plugin } from 'esbuild';
import less from 'less';
import { convertLessError, getLessImports } from './less-utils';

export interface LoaderOptions {
  /* custom filter */
  filter?: RegExp;
}

/** Less-loader for esbuild */
export const lessLoader = (options: Less.Options = {}, loaderOptions: LoaderOptions = {}): Plugin => {
  return {
    name: 'less-loader',
    setup: (build) => {
      const filter = loaderOptions.filter;

      // Resolve *.less files with namespace
      build.onResolve({ filter: filter || /\.less$/, namespace: 'file' }, (args) => {
        const filePath = path.resolve(process.cwd(), path.relative(process.cwd(), args.resolveDir), args.path);
        return {
          path: filePath,
          watchFiles: !!build.initialOptions.watch ? [filePath, ...getLessImports(filePath)] : undefined,
        };
      });

      // Build .less files
      build.onLoad({ filter: filter || /\.less$/, namespace: 'file' }, async (args) => {
        const content = await fs.readFile(args.path, 'utf-8');
        const dir = path.dirname(args.path);

        const opts: Less.Options = {
          filename: args.path,
          relativeUrls: true,
          ...options,
          paths: [...(options.paths || []), dir],
        } as any;

        try {
          const result = await less.render(content, opts);

          return {
            contents: result.css,
            loader: 'css',
            resolveDir: dir,
          };
        } catch (e) {
          return {
            errors: [convertLessError(e)],
            resolveDir: dir,
          };
        }
      });
    },
  };
};
