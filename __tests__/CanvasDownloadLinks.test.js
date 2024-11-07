import React from 'react';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import CanvasDownloadLinks from '../src/CanvasDownloadLinks';
import { render, screen } from './test-utils';

/**
 * Helper function to render the CanvasDownloadLinks component with custom props.
 */
function createWrapper(props) {
  return render(
    <CanvasDownloadLinks
      canvasId="abc123"
      canvasLabel="My Canvas Label"
      classes={{}}
      infoResponse={{}}
      restrictDownloadOnSizeDefinition={false}
      viewType="single"
      windowId="wid123"
      {...props}
    />,
  );
}

describe('CanvasDownloadLinks', () => {
  const canvas = {
    id: 'abc123',
    getCanonicalImageUri: (width) => (
      width
        ? `http://example.com/iiif/abc123/full/${width},/0/default.jpg`
        : 'http://example.com/iiif/abc123/full/4000,/0/default.jpg'
    ),
    getHeight: () => 1000,
    getWidth: () => 4000,
    getRenderings: () => [
      {
        id: 'http://example.com/abc123.pdf',
        getLabel: () => ({ getValue: () => 'Link to the PDF' }),
        getFormat: () => ({ value: 'application/pdf' }),
      },
    ],
  };

  let currentBoundsSpy;

  beforeEach(() => {
    currentBoundsSpy = jest.spyOn(CanvasDownloadLinks.prototype, 'currentBounds');
  });

  afterEach(() => {
    currentBoundsSpy.mockRestore();
  });

  it('renders the canvas label as an h3 heading', () => {
    createWrapper({ canvas });

    const headingElement = screen.getByText('My Canvas Label');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H3');
  });

  it('renders canvas-level renderings', () => {
    createWrapper({ canvas });

    const downloadLink = screen.getByRole('link', { name: /Whole image \(4000 x 1000px\)/i });
    expect(downloadLink).toBeInTheDocument();
  });

  describe('Zoomed region link behavior', () => {
    const infoResponse = {
      json: { width: 4000, height: 1000 },
    };

    it('does not render a zoom link when the viewer is zoomed out to the entire image', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: 0, y: 0, width: 6000, height: 1000,
      }));

      createWrapper({ canvas, infoResponse, windowId: 'zoomedOutWindow' });

      const zoomedLink = screen.queryByText('Zoomed region (6000 x 1000px)');
      expect(zoomedLink).not.toBeInTheDocument();
    });

    it('does not render a link when zoomed into non-image space', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: -100, y: 100, width: 2000, height: 500,
      }));

      createWrapper({ canvas, infoResponse, windowId: 'zoomedIntoNonImageSpaceWindow' });

      const zoomedLink = screen.queryByText('Zoomed region (2000 x 500px)');
      expect(zoomedLink).not.toBeInTheDocument();
    });

    it('renders a zoomed region link when zoomed into the image', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: 0, y: 0, width: 2000, height: 500,
      }));

      createWrapper({ canvas, infoResponse, windowId: 'zoomedInWindow' });

      const zoomedLink = screen.queryByText('Zoomed region (2000 x 500px)');
      expect(zoomedLink).toBeInTheDocument();
    });

    it('does not render a zoomed region link in non-single view types (e.g., book or gallery view)', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: 0, y: 0, width: 2000, height: 500,
      }));

      createWrapper({
        canvas, infoResponse, viewType: 'book', windowId: 'zoomedInWindow',
      });
      const zoomedLink = screen.queryByText('Zoomed region (2000 x 500px)');
      expect(zoomedLink).not.toBeInTheDocument();

      createWrapper({
        canvas, infoResponse, viewType: 'gallery', windowId: 'zoomedInWindow',
      });
      const zoomedLinkGallery = screen.queryByText('Zoomed region (2000 x 500px)');
      expect(zoomedLinkGallery).not.toBeInTheDocument();
    });

    describe('when zoom link is restricted', () => {
      it('only renders a whole image link based on the available sizes', () => {
        createWrapper({
          canvas,
          infoResponse: {
            json: {
              width: 4000,
              height: 1000,
              sizes: [{ width: 400, height: 100 }],
            },
          },
          restrictDownloadOnSizeDefinition: true,
          windowId: 'zoomedInWindow',
        });

        const downloadLink = screen.getByRole('link', { name: /Whole image \(400 x 100px\)/i });
        expect(screen.getAllByRole('link')).toHaveLength(2); // Should only show small-size version and link to PDF.
        expect(downloadLink).toBeInTheDocument();
      });
    });
  });

  describe('when sizes are defined in the infoResponse', () => {
    const sizes = [
      { width: 4000, height: 1000 },
      { width: 2000, height: 500 },
      { width: 1000, height: 250 },
    ];

    const viewport = {
      getBounds: () => ({
        x: 0, y: 0, width: 4000, height: 1000,
      }),
    };
    OSDReferences.set('wid123', {
      current: { viewport },
    });
    it('renders download links for all sizes in the dialog', () => {
      createWrapper({ canvas, infoResponse: { json: { sizes } } });

      const link1 = screen.getByRole('link', { name: /Whole image \(4000 x 1000px\)/i });
      const link2 = screen.getByRole('link', { name: /Whole image \(2000 x 500px\)/i });
      const link3 = screen.getByRole('link', { name: /Whole image \(1000 x 250px\)/i });

      expect(link1).toBeInTheDocument();
      expect(link2).toBeInTheDocument();
      expect(link3).toBeInTheDocument();
    });
  });

  describe('when no sizes are defined', () => {
    it('renders a link to the full-size image', () => {
      createWrapper({ canvas });

      const link = screen.getByRole('link', { name: /Whole image \(4000 x 1000px\)/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'http://example.com/iiif/abc123/full/full/0/default.jpg?download=true');
    });

    describe('when the image width exceeds 1000px', () => {
      it('renders links to both the full-size and smaller (1000px wide) versions', () => {
        createWrapper({ canvas });

        const link1 = screen.getByRole('link', { name: /Whole image \(4000 x 1000px\)/i });
        expect(link1).toHaveAttribute('href', 'http://example.com/iiif/abc123/full/full/0/default.jpg?download=true');

        const link2 = screen.getByRole('link', { name: /Whole image \(1000 x 250px\)/i });
        expect(link2).toHaveAttribute('href', 'http://example.com/iiif/abc123/full/1000,/0/default.jpg?download=true');
      });
    });

    describe('when the image width is less than 1000px', () => {
      it('does not render a link to a smaller version', () => {
        canvas.getWidth = () => 999;
        createWrapper({ canvas });

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(2); // Should only show full-size version and link to PDF.
      });
    });
  });
});
