import React from 'react';
import miradorDownloadPlugin from '../src/miradorDownloadPlugin';
import { fireEvent, render, screen } from './test-utils';

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
  it('sets the correct target to "WindowTopBarPluginMenu"', () => {
    expect(miradorDownloadPlugin.target).toBe('WindowTopBarPluginMenu');
  });
  describe('Component Rendering', () => {
    it('displays a "Download" element when rendered', () => {
      createWrapper();
      const downloadElement = screen.queryByText(/Download/i);
      expect(downloadElement).toBeInTheDocument();
    });
  });
});

describe('MenuItem', () => {
  it('triggers both openDownloadDialog and handleClose when "Download" is clicked', async () => {
    const handleClose = jest.fn();
    const openDownloadDialog = jest.fn();
    createWrapper({ handleClose, openDownloadDialog });
    const openDownloadDialogButton = await screen.findByText(/Download/);
    fireEvent.click(openDownloadDialogButton);
    expect(handleClose).toHaveBeenCalled();
    expect(openDownloadDialog).toHaveBeenCalled();
  });
});
