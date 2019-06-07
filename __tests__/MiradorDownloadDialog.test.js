import React from 'react';
import { shallow } from 'enzyme';
import miradorDownloadDialog from '../src/MiradorDownloadDialog';

/** Utility function to wrap  */
function createWrapper(props) {
  return shallow(
    <miradorDownloadDialog.component
      canvasLabel={label => (label || 'My Canvas Title')}
      canvases={[]}
      classes={{}}
      closeDialog={() => {}}
      manifest={{ getSequences: () => [] }}
      open
      viewType="single"
      windowId="wid123"
      {...props}
    />,
  ).dive();
}

describe('Dialog', () => {
  let wrapper;

  it('does not render anything if the open prop is false', () => {
    wrapper = createWrapper({ open: false });
    expect(wrapper).toEqual({});
  });

  it('renders a CanvasDownloadLinks componewnt for every canvas', () => {
    const mockCanvas = id => ({
      id,
      getHeight: () => 4000,
      getWidth: () => 1000,
      getCanonicalImageUri: () => 'https://example.com/iiif/abc123/full/9000,/0/default.jpg',
    });
    wrapper = createWrapper({ canvases: [mockCanvas('abc123'), mockCanvas('xyz321')] });
    expect(wrapper.find('CanvasDownloadLinks').length).toBe(2);
  });

  it('has a close button that triggers the closeDialog prop', () => {
    const closeDialog = jest.fn();
    wrapper = createWrapper({ closeDialog });
    wrapper.find('WithStyles(Button)').simulate('click');
    expect(closeDialog).toHaveBeenCalled();
  });

  describe('ManifestDownloadLinks', () => {
    it('is not rendered if hte manifest has no renderings', () => {
      wrapper = createWrapper();

      expect(wrapper.find('ManifestDownloadLinks').length).toBe(0);
    });
    it('rendered if the manifest has renderings', () => {
      const rendering = { id: '', getLabel: () => {}, getFormat: () => {} };
      wrapper = createWrapper({
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
