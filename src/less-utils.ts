import fs from 'fs';
import path from 'path';
import { PartialMessage } from 'esbuild';

const importRegex = /@import.*?["']([^"']+)["'].*?/;
const globalImportRegex = /@import.*?["']([^"']+)["'].*?/g;
const importCommentRegex = /(?:\/\*(?:[\s\S]*?)\*\/)|(\/\/(?:.*)$)/gm;

const extWhitelist = ['.css', '.less'];

/** Recursively get .less/.css imports from file */
export const getLessImports = (filePath: string, paths: string[] = []): string[] => {
  try {
    const dir = path.dirname(filePath);
    const content = fs.readFileSync(filePath).toString('utf8');

    const cleanContent = content.replace(importCommentRegex, '');
    const match = cleanContent.match(globalImportRegex) || [];

    const fileImports = match
      .map((el) => {
        const match = el.match(importRegex);
        return match[1];
      })
      .filter((el) => !!el)
      // NOTE: According to the docs, extensionless imports are interpreted as '.less' files.
      // http://lesscss.org/features/#import-atrules-feature-file-extensions
      // https://github.com/iam-medvedev/esbuild-plugin-less/issues/13
      .map((el) => {
        // Assume the file exists at the default import. If it does not, check relative to provided
        // import paths too, and take the first path that resolves to a real file.
        let filepath = path.resolve(dir, path.extname(el) ? el : `${el}.less`);
        if (!fs.existsSync(filepath)) {
          for (let i = 0; i < paths.length; i++) {
            const f = path.resolve(paths[i], path.extname(el) ? el : `${el}.less`);
            if (fs.existsSync(f)) {
              filepath = f;
              break;
            }
          }
        }
        return filepath;
      });

    const recursiveImports = fileImports.reduce((result, el) => {
      return [...result, ...getLessImports(el, paths)];
    }, fileImports);

    const result = recursiveImports.filter((el) => extWhitelist.includes(path.extname(el).toLowerCase()));

    return result;
  } catch (e) {
    return [];
  }
};

/** Convert less error into esbuild error */
export const convertLessError = (error: Less.RenderError): PartialMessage => {
  const sourceLine = error.extract.filter((line) => line);
  const lineText = sourceLine.length === 3 ? sourceLine[1] : sourceLine[0];

  return {
    text: error.message,
    location: {
      namespace: 'file',
      file: error.filename,
      line: error.line,
      column: error.column,
      lineText,
    },
  };
};
