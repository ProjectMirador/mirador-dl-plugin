import miradorDownloadPlugin from '../src';

describe('miradorDownloadPlugin', () => {
  it('has the correct target', () => {
    expect(miradorDownloadPlugin.target).toBe('WindowTopMenu');
  });
});
