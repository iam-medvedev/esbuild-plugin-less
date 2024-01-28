import type { Loader, Plugin } from 'esbuild';
import path from 'path';
import { promises as fs } from 'fs';
import less from 'less';
import { convertLessError, getLessImports } from './less-utils';

export interface LoaderOptions {
  /* custom filter */
  filter?: RegExp;
}

/** Less-loader for esbuild */
export function lessLoader(options: Less.Options = {}, loaderOptions: LoaderOptions = {}): Plugin {
  return {
    name: 'less-loader',
    setup: (build) => {
      const filter = loaderOptions.filter;

      // Resolve *.less files with namespace
      build.onResolve({ filter: filter || /\.less$/, namespace: 'file' }, async (args) => {
        const pathResolve = await build.resolve(args.path, {
          kind: args.kind,
          importer: args.importer,
          resolveDir: args.resolveDir,
          pluginData: args.pluginData,
        });
        const filePath = pathResolve.path;

        return {
          path: filePath,
          watchFiles: [filePath, ...getLessImports(filePath, options.paths || [])],
        };
      });

      // Build .less files
      build.onLoad({ filter: filter || /\.less$/, namespace: 'file' }, async (args) => {
        const content = await fs.readFile(args.path, 'utf-8');
        const dir = path.dirname(args.path);
        const basename = path.basename(args.path);
        const isModule = basename.endsWith('.module.less');
        const loader: Loader = isModule ? 'local-css' : 'css';

        const opts: Less.Options & { relativeUrls: boolean } = {
          filename: args.path,
          relativeUrls: true,
          ...options,
          paths: [...(options.paths || []), dir],
        };

        try {
          const result = await less.render(content, opts);

          return {
            contents: result.css,
            loader,
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
}
