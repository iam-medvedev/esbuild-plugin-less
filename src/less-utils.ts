import fs from 'fs';
import path from 'path';

const importRegex = /@import(?:\s+\((.*)\))?\s+['"](.*)['"]/;
const globalImportRegex = /@import(?:\s+\((.*)\))?\s+['"](.*)['"]/g;
const importCommentRegex = /(?:\/\*(?:[\s\S]*?)\*\/)|(\/\/(?:.*)$)/gm;

const extWhitelist = ['.css', '.less'];

/** Recursively get .less/.css imports from file */
export const getLessImports = (filePath: string): string[] => {
  try {
    const dir = path.dirname(filePath);
    const content = fs.readFileSync(filePath).toString('utf8');

    const cleanContent = content.replace(importCommentRegex, '');
    const match = cleanContent.match(globalImportRegex) || [];

    const fileImports = match
      .map((el) => {
        const match = el.match(importRegex);
        return match[2];
      })
      .filter((el) => !!el)
      .map((el) => path.resolve(dir, el));

    const recursiveImports = fileImports.reduce((result, el) => {
      return [...result, ...getLessImports(el)];
    }, fileImports);

    const result = recursiveImports.filter((el) => extWhitelist.includes(path.extname(el).toLowerCase()));

    return result;
  } catch (e) {
    return [];
  }
};
