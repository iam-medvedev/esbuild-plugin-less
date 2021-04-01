import path from 'path';
import { getLessImports } from '../src/less-utils';

describe('less-utils', () => {
  it('get imports paths', () => {
    const filePath = path.resolve(__dirname, '../example/styles/style.less');
    const imports = getLessImports(filePath);

    expect(imports).toEqual(
      expect.arrayContaining([
        expect.stringContaining('styles/style-2.less'),
        expect.stringContaining('styles/inner/style-3.less'),
        expect.stringContaining('styles/inner/style-4.css'),
        expect.stringContaining('styles/inner/style-5.css'),
      ]),
    );
  });
});
