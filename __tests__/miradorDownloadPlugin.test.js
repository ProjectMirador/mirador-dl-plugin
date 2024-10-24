import React from 'react';
import miradorDownloadPlugin from '../src/miradorDownloadPlugin';
import { render, screen } from './test-utils';

function createWrapper(props) {
  return render(
    <miradorDownloadPlugin.component
      handleClose={() => {}}
      openDownloadDialog={() => {}}
      {...props}
    />,
  );
}

describe('miradorDownloadPlugin', () => {
  it('has the correct target', () => {
    expect(miradorDownloadPlugin.target).toBe('WindowTopBarPluginMenu');
  });
  describe('renders a component', () => {
    it('renders a thing', () => {
      createWrapper();
      const downloadElement = screen.queryByText(/Download/i);
      expect(downloadElement).toBeInTheDocument();
    });
  });
});
