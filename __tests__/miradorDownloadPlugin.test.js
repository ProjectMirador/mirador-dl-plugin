import React from 'react';
import { shallow } from 'enzyme';
import miradorDownloadPlugin from '../src';

function createWrapper(props) {
  return shallow(
    <miradorDownloadPlugin.component
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
      expect(wrapper.find('h2').text()).toEqual('Download');
    });
  });
});
