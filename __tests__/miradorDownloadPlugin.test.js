import React from 'react';
import { shallow } from 'enzyme';
import miradorDownloadPlugin from '../src';

function createWrapper(props) {
  return shallow(
    <miradorDownloadPlugin.component
      canvasLabel={label => (label || 'My Canvas Title')}
      canvases={[]}
      manifest={{ getSequences: () => [] }}
      viewType="single"
      windowId="wid123"
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

    it('renders a CanvasDownloadLinks componewnt for every canvas', () => {
      const mockCanvas = id => ({
        id,
        getHeight: () => 4000,
        getWidth: () => 1000,
        getCanonicalImageUri: () => 'https://example.com/iiif/abc123/full/9000,/0/default.jpg',
      });
      const wrapper = createWrapper({ canvases: [mockCanvas('abc123'), mockCanvas('xyz321')] });
      expect(wrapper.find('CanvasDownloadLinks').length).toBe(2);
    });

    it('has a close button that updates the modealDisplay state to false', () => {
      const wrapper = createWrapper();
      wrapper.setState({ modalDisplayed: true });
      expect(wrapper.state().modalDisplayed).toBe(true);
      wrapper.find('WithStyles(Button)').simulate('click');
      expect(wrapper.state().modalDisplayed).toBe(false);
    });

    describe('ManifestDownloadLinks', () => {
      it('is not rendered if hte manifest has no renderings', () => {
        const wrapper = createWrapper();

        expect(wrapper.find('ManifestDownloadLinks').length).toBe(0);
      });
      it('rendered if the manifest has renderings', () => {
        const rendering = { id: '', getLabel: () => {}, getFormat: () => {} };
        const wrapper = createWrapper({
          manifest: {
            getSequences: () => [
              { getRenderings: () => [rendering] },
            ],
          },
        });

        expect(wrapper.find('ManifestDownloadLinks').length).toBe(1);
      });
    });
  });
});
