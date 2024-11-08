import React from 'react';
import miradorDownloadDialog from '../src/MiradorDownloadDialog';
import { fireEvent, render, screen } from './test-utils';

/** Utility function to wrap  */
function createWrapper(props) {
  return render(
    <miradorDownloadDialog.component
      canvasLabel={(label) => (label || 'My Canvas Title')}
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
  );
}

describe('Dialog', () => {
  it('does not render content when the open prop is false', () => {
    createWrapper({ open: false });
    expect(screen.queryByTestId('dialog-content')).toBeNull();
  });

  it('renders a CanvasDownloadLinks component with headings for each canvas', () => {
    const mockCanvas = (id) => ({
      id,
      getHeight: () => 4000,
      getWidth: () => 1000,
      getRenderings: () => [],
      getCanonicalImageUri: () => 'https://example.com/iiif/abc123/full/9000,/0/default.jpg',
    });
    createWrapper({ canvases: [mockCanvas('abc123'), mockCanvas('xyz321')] });

    const headings = screen.getAllByRole('heading');
    const headingAbc = headings.find((heading) => (heading.textContent === 'abc123'));
    expect(headingAbc).toBeInTheDocument();
    expect(headingAbc.tagName).toBe('H3');

    const headingXyz = headings.find((heading) => (heading.textContent === 'xyz321'));
    expect(headingXyz).toBeInTheDocument();
    expect(headingXyz.tagName).toBe('H3');
  });

  it('calls the closeDialog function when the close button is clicked', async () => {
    const closeDialog = jest.fn();
    createWrapper({ closeDialog });
    const closeButton = await screen.findByText(/Close/);
    fireEvent.click(closeButton);
    expect(closeDialog).toHaveBeenCalled();
  });

  describe('ManifestDownloadLinks', () => {
    it('does not render when there are no manifest renderings', () => {
      createWrapper();
      const manifestLinks = screen.queryByText('ManifestDownloadLinks');
      expect(manifestLinks).not.toBeInTheDocument();
    });

    it('renders when the manifest contains renderings', () => {
      const rendering = { id: '', getLabel: () => ({ getValue: () => 'ManifestDownloadLinks' }), getFormat: () => {} };
      createWrapper({
        manifest: {
          getSequences: () => [
            {
              getRenderings: () => [rendering],
            },
          ],
        },
      });
      const manifestLinks = screen.queryByText('ManifestDownloadLinks');
      expect(manifestLinks).toBeInTheDocument();
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
    it('fetches the correct info response for the given canvas ID', () => {
      expect(mapStateToProps.infoResponse('http://example.com/abc123/canvas/0').json.sizes.length).toBe(6);
    });
  });
});
