import React from 'react';
import { shallow } from 'enzyme';
import Button from '@material-ui/core/Button';
import miradorDownloadDialog from '../src/MiradorDownloadDialog';

/** Utility function to wrap  */
function createWrapper(props) {
  return shallow(
    <miradorDownloadDialog.component
      canvasLabel={label => (label || 'My Canvas Title')}
      canvases={[]}
      classes={{}}
      closeDialog={() => {}}
      containerId="container-123"
      infoResponse={() => ({})}
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
      getRenderings: () => [],
      getCanonicalImageUri: () => 'https://example.com/iiif/abc123/full/9000,/0/default.jpg',
    });
    wrapper = createWrapper({ canvases: [mockCanvas('abc123'), mockCanvas('xyz321')] });
    expect(wrapper.find('CanvasDownloadLinks').length).toBe(2);
  });

  it('has a close button that triggers the closeDialog prop', () => {
    const closeDialog = jest.fn();
    wrapper = createWrapper({ closeDialog });
    wrapper.find(Button).simulate('click');
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

describe('mapStateToProps', () => {
  const state = {
    infoResponses: {
      'https://example.com/image/iiif/abc123_0001': {
        json: {
          width: 2579,
          height: 3638,
          sizes: [
            {
              width: 81,
              height: 114,
            },
            {
              width: 161,
              height: 227,
            },
            {
              width: 322,
              height: 455,
            },
            {
              width: 645,
              height: 909,
            },
            {
              width: 1290,
              height: 1819,
            },
            {
              width: 2579,
              height: 3638,
            },
          ],
        },
      },
    },
    manifests: {
      'http://example.com/abc123/iiif/manifest': {
        json: {
          '@type': 'sc:Manifest',
          sequences: [
            {
              canvases: [
                {
                  '@id': 'http://example.com/abc123/canvas/0',
                  images: [
                    {
                      resource: {
                        service: {
                          '@id': 'https://example.com/image/iiif/abc123_0001',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    windows: {
      'window-abc123': {
        manifestId: 'http://example.com/abc123/iiif/manifest',
      },
    },
    windowDialogs: {},
    config: {},
  };
  const props = { windowId: 'window-abc123' };
  const mapStateToProps = miradorDownloadDialog.mapStateToProps(state, props);

  describe('infoResponse', () => {
    it('gets the correct info response from state', () => {
      expect(mapStateToProps.infoResponse('http://example.com/abc123/canvas/0').json.sizes.length).toBe(6);
    });
  });
});
