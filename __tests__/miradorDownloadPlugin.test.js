import React from 'react';
import { shallow } from 'enzyme';
import miradorDownloadPlugin from '../src';

function createWrapper(props) {
  return shallow(
    <miradorDownloadPlugin.component
      title="My Canvas Title"
      {...props}
    />,
  );
}

describe('miradorDownloadPlugin', () => {
  it('has the correct target', () => {
    expect(miradorDownloadPlugin.target).toBe('WindowTopMenu');
  });
  describe('renders a component', () => {
    it('renders a thing', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('WithStyles(ListItemText)').props().children).toEqual('Download');
    });
  });

  describe('MenuItem', () => {
    it('udpates the modalDisplayed state which clicked', () => {
      const wrapper = createWrapper();
      expect(wrapper.state().modalDisplayed).toBe(false);
      wrapper.find('WithStyles(MenuItem)').simulate('click');
      expect(wrapper.state().modalDisplayed).toBe(true);
    });
  });

  describe('Dialog', () => {
    it('renders a dialog that is open/closed based on the component state', () => {
      const wrapper = createWrapper();
      expect(wrapper.state().modalDisplayed).toBe(false);
      expect(wrapper.find('WithStyles(Dialog)').props().open).toBe(false);
      wrapper.setState({ modalDisplayed: true });
      expect(wrapper.find('WithStyles(Dialog)').props().open).toBe(true);
    });

    it('renders the title prop in an h3', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('WithStyles(Typography)[variant="h3"]').props().children).toEqual('My Canvas Title');
    });

    it('has a close button that updates the modealDisplay state to false', () => {
      const wrapper = createWrapper();
      wrapper.setState({ modalDisplayed: true });
      expect(wrapper.state().modalDisplayed).toBe(true);
      wrapper.find('WithStyles(Button)').simulate('click');
      expect(wrapper.state().modalDisplayed).toBe(false);
    });
  });
});
