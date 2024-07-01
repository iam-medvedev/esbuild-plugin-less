import { describe, expect, it } from 'vitest';
import path from 'path';
import { convertLessError, getLessImports } from '../src/less-utils';

describe('less-utils', () => {
  it('get imports paths', () => {
    const filePath = path.resolve(__dirname, '../example/styles/style.less');
    const imports = getLessImports(filePath);

    expect(imports).toHaveLength(5);
    expect(imports).toEqual(
      expect.arrayContaining([
        expect.stringContaining('styles/style-2.less'),
        expect.stringContaining('styles/inner/style-3.less'),
        expect.stringContaining('styles/inner/style-4.css'),
        expect.stringContaining('styles/inner/style-5.css'),
        expect.stringContaining('styles/without-ext.less'),
      ]),
    );
  });

  it('get imports paths with options', () => {
    const filePath = path.resolve(__dirname, '../example/styles/style.less');
    const imports = getLessImports(filePath, ['../example', '../example/styles']);

    expect(imports).toHaveLength(5);
    expect(imports).toEqual(
      expect.arrayContaining([
        expect.stringContaining('styles/style-2.less'),
        expect.stringContaining('styles/inner/style-3.less'),
        expect.stringContaining('styles/inner/style-4.css'),
        expect.stringContaining('styles/inner/style-5.css'),
        expect.stringContaining('styles/without-ext.less'),
      ]),
    );
  });

  it('works with recursive imports', () => {
    const filePath = path.resolve(__dirname, '../example/styles/recursive/a.less');
    const imports = getLessImports(filePath);

    expect(imports).toHaveLength(2);
    expect(imports).toEqual(
      expect.arrayContaining([
        expect.stringContaining('styles/recursive/a.less'),
        expect.stringContaining('styles/recursive/b.less'),
      ]),
    );
  });

  it('do not process a file if it has already been processed', () => {
    const filePath = path.resolve(__dirname, '../example/styles/recursive/a.less');
    const visited = new Set<string>();
    visited.add(filePath);

    const imports = getLessImports(filePath, [], visited);
    expect(imports).toHaveLength(0);
  });

  it('get imports paths fail', () => {
    const filePath = path.resolve(__dirname, '../example/styles/unknown-file.less');
    const imports = getLessImports(filePath);

    expect(imports).toEqual([]);
  });

  it('converts less error into esbuild error with 3-line-error', () => {
    const lessError = {
      type: 'Name',
      message: 'variable @some-undefined-var is undefined',
      filename: '/example/styles/style-2.less',
      index: 63,
      line: 4,
      column: 14,
      extract: ['.style-2-less {', '  background: @some-undefined-var;', '  color: red;'],
    };

    const error = convertLessError(lessError);

    expect(error).toMatchObject({
      text: lessError.message,
      location: {
        namespace: 'file',
        file: lessError.filename,
        line: lessError.line,
        column: lessError.column,
        lineText: lessError.extract[1],
      },
    });
  });

  it('converts less error into esbuild error with 1-line-error', () => {
    const lessError = {
      type: 'Name',
      message: 'variable @some-undefined-var is undefined',
      filename: '/example/styles/style-2.less',
      index: 0,
      line: 0,
      column: 0,
      extract: ['.style-2-less {'],
    };

    const error = convertLessError(lessError);

    expect(error).toMatchObject({
      text: lessError.message,
      location: {
        namespace: 'file',
        file: lessError.filename,
        line: lessError.line,
        column: lessError.column,
        lineText: lessError.extract[0],
      },
    });
  });
});
