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

describe('MenuItem', () => {
  it('calls the openShareDialog and handleClose props when clicked', async () => {
    const handleClose = jest.fn();
    const openDownloadDialog = jest.fn();
    createWrapper({ handleClose, openDownloadDialog });
    const openDownloadDialogButton = await screen.findByText(/Download/);
    fireEvent.click(openDownloadDialogButton);
    expect(handleClose).toHaveBeenCalled();
    expect(openDownloadDialog).toHaveBeenCalled();
  });
});
