import { build, Format } from 'esbuild';
import * as path from 'path';

const formats: Format[] = ['cjs', 'esm'];

function getOutputFilename(format: Format) {
  switch (format) {
    case 'esm':
      return `${format}.mjs`;
    default:
      return `${format}.js`;
  }
}

async function createBuild() {
  for (const format of formats) {
    const outputFilename = getOutputFilename(format);

    try {
      await build({
        entryPoints: [path.resolve(__dirname, '..', 'src', 'index.ts')],
        bundle: true,
        minify: true,
        platform: 'node',
        loader: {
          '.ts': 'ts',
        },
        external: ['less', 'path', 'fs'],
        outfile: path.resolve(__dirname, '..', 'build', outputFilename),
        format,
      });

      console.info(`— ${outputFilename} was built`);
    } catch (e) {
      console.info(`🚨 ${outputFilename} build error:`);
      console.error(e);
    }
  }
}

createBuild();
