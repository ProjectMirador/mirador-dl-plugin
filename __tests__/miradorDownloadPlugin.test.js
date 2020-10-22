import React from 'react';
import { shallow } from 'enzyme';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import miradorDownloadPlugin from '../src/miradorDownloadPlugin';

function createWrapper(props) {
  return shallow(
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
      const wrapper = createWrapper();
      expect(wrapper.find(ListItemText).props().children).toEqual('Download');
    });
  });

  describe('MenuItem', () => {
    it('calls the openShareDialog and handleClose props when clicked', () => {
      const handleClose = jest.fn();
      const openDownloadDialog = jest.fn();
      const wrapper = createWrapper({ handleClose, openDownloadDialog });
      wrapper.find(MenuItem).simulate('click');
      expect(handleClose).toHaveBeenCalled();
      expect(openDownloadDialog).toHaveBeenCalled();
    });
  });
});
