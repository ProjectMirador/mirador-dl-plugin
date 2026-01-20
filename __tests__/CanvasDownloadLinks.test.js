import { OSDReferences } from 'mirador';
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
      restrictDownloadOnSizeDefinition={false}
      viewType="single"
      windowId="wid123"
      t={(k, v) => `${k} ${JSON.stringify(v)}`}
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

  const infoResponse = {
    json: {
      '@context': 'http://iiif.io/api/image/2/context.json',
      '@id': 'http://example.com/iiif/abc123/',
      width: 4000,
      height: 1000,
      profile: [
        'http://iiif.io/api/image/2/level1.json',
      ],
    },
  };

  let currentBoundsSpy;

  beforeEach(() => {
    currentBoundsSpy = vi.spyOn(CanvasDownloadLinks.prototype, 'currentBounds');
  });

  afterEach(() => {
    currentBoundsSpy.mockRestore();
  });

  it('renders the canvas label as an h3 heading', () => {
    createWrapper({ canvas, infoResponse });

    const headingElement = screen.getByText('My Canvas Label');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H3');
  });

  describe('Canvas Renderings', () => {
    it('includes a canvas-level rendering as a download link', () => {
      createWrapper({ canvas, infoResponse });

      const downloadLink = screen.getByRole('link', { name: /mirador-dl-plugin\.whole_image {"width":4000,"height":1000}/i });
      expect(downloadLink).toBeInTheDocument();
    });
  });

  describe('Zoomed Region Links', () => {
    it('does not render a zoom link when viewer is zoomed out to full image', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: 0, y: 0, width: 6000, height: 1000,
      }));

      createWrapper({ canvas, infoResponse, windowId: 'zoomedOutWindow' });

      const zoomedLink = screen.queryByText('mirador-dl-plugin.zoomed_region {"width":6000,"height":1000}');
      expect(zoomedLink).not.toBeInTheDocument();
    });

    it('does not render a zoom link when zoomed into an area outside of the image bounds', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: -100, y: 100, width: 2000, height: 500,
      }));

      createWrapper({ canvas, infoResponse, windowId: 'zoomedIntoNonImageSpaceWindow' });

      const zoomedLink = screen.queryByText('mirador-dl-plugin.zoomed_region {"width":2000,"height":500}');
      expect(zoomedLink).not.toBeInTheDocument();
    });

    it('renders a zoomed region link when zoomed into a valid area of the image', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: 0, y: 0, width: 2000, height: 500,
      }));

      createWrapper({ canvas, infoResponse, windowId: 'zoomedInWindow' });

      const zoomedLink = screen.queryByText('mirador-dl-plugin.zoomed_region {"width":2000,"height":500}');
      expect(zoomedLink).toBeInTheDocument();
    });

    it('does not render a zoomed region link in non-single view types (e.g., book, gallery views)', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: 0, y: 0, width: 2000, height: 500,
      }));

      createWrapper({
        canvas, infoResponse, viewType: 'book', windowId: 'zoomedInWindow',
      });
      const zoomedLink = screen.queryByText('mirador-dl-plugin.zoomed_region {"width":2000,"height":500}');
      expect(zoomedLink).not.toBeInTheDocument();

      createWrapper({
        canvas, infoResponse, viewType: 'gallery', windowId: 'zoomedInWindow',
      });
      const zoomedLinkGallery = screen.queryByText('mirador-dl-plugin.zoomed_region {"width":2000,"height":500}');
      expect(zoomedLinkGallery).not.toBeInTheDocument();
    });

    describe('Download Link Size Restrictions', () => {
      it('renders only a single download link based on the restricted sizes', () => {
        createWrapper({
          canvas,
          infoResponse: {
            json: {
              ...infoResponse.json,
              sizes: [{ width: 400, height: 100 }],
            },
          },
          restrictDownloadOnSizeDefinition: true,
          windowId: 'zoomedInWindow',
        });

        const downloadLink = screen.getByRole('link', { name: /mirador-dl-plugin\.whole_image {"width":400,"height":100}/i });
        expect(screen.getAllByRole('link')).toHaveLength(2); // Should only show small-size version and link to PDF.
        expect(downloadLink).toBeInTheDocument();
      });
    });
  });

  describe('When Defined Sizes Are Present in infoResponse', () => {
    const infoResponseWithSizes = {
      json: {
        ...infoResponse.json,
        sizes: [
          { width: 4000, height: 1000 },
          { width: 2000, height: 500 },
          { width: 1000, height: 250 },
        ],
      },
    };

    const viewport = {
      getBounds: () => ({
        x: 0, y: 0, width: 4000, height: 1000,
      }),
    };
    OSDReferences.set('wid123', {
      current: { viewport },
    });
    it('renders download links for all specified sizes in the dialog', () => {
      createWrapper({ canvas, infoResponse: infoResponseWithSizes });

      const link1 = screen.getByRole('link', { name: /mirador-dl-plugin\.whole_image {"width":4000,"height":1000}/i });
      const link2 = screen.getByRole('link', { name: /mirador-dl-plugin\.whole_image {"width":2000,"height":500}/i });
      const link3 = screen.getByRole('link', { name: /mirador-dl-plugin\.whole_image {"width":1000,"height":250}/i });

      expect(link1).toBeInTheDocument();
      expect(link2).toBeInTheDocument();
      expect(link3).toBeInTheDocument();
    });
  });

  describe('When No Sizes Are Defined in infoResponse', () => {
    it('renders a single link to the full-size image', () => {
      createWrapper({ canvas, infoResponse });

      const link = screen.getByRole('link', { name: /mirador-dl-plugin\.whole_image {"width":4000,"height":1000}/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'http://example.com/iiif/abc123/full/full/0/default.jpg?download=true');
    });

    describe('For Images Wider Than 1000px', () => {
      it('renders links for both full-size and 1000px wide versions', () => {
        createWrapper({ canvas, infoResponse });

        const link1 = screen.getByRole('link', { name: /mirador-dl-plugin\.whole_image {"width":4000,"height":1000}/i });
        expect(link1).toHaveAttribute('href', 'http://example.com/iiif/abc123/full/full/0/default.jpg?download=true');

        const link2 = screen.getByRole('link', { name: /mirador-dl-plugin\.whole_image {"width":1000,"height":250}/i });
        expect(link2).toHaveAttribute('href', 'http://example.com/iiif/abc123/full/1000,/0/default.jpg?download=true');
      });
    });

    describe('For Images Less Than 1000px Wide', () => {
      it('does not render a smaller version link if image is under 1000px wide', () => {
        const smallCanvas = { ...canvas, getWidth: () => 999 };
        const smallInfoResponse = {
          json: {
            ...infoResponse.json,
            width: 999,
          },
        };
        createWrapper({ canvas: smallCanvas, infoResponse: smallInfoResponse });

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(2); // Should only show full-size version and link to PDF.
      });
    });
  });
});
