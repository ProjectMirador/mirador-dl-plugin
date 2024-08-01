import React from 'react';
import CanvasDownloadLinks from '../src/CanvasDownloadLinks';

import { render, screen } from './test-utils';

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

  it('renders canvas label in an h3 typography', () => {
    createWrapper({ canvas });

    screen.getByRole('heading');
    const headingElement = screen.getByText('My Canvas Label');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H3');
  });

  it('renders canvas level renderings', () => {
    createWrapper({ canvas });

    const dlElement = screen.getByRole('link', { name: /Whole image \(4000 x 1000px\)/i });
    expect(dlElement).toBeInTheDocument();
  });

  describe('Zoomed region link', () => {
    const infoResponse = {
      json: { width: 4000, height: 1000 },
    };

    it('does not render a link when the viewer is zoomed out/at the entire image', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: 0, y: 0, width: 6000, height: 1000,
      }));

      createWrapper({ canvas, infoResponse, windowId: 'zoomedOutWindow' });
      const zoomedLink = screen.queryByText('Zoomed region (6000 x 1000px)');
      expect(zoomedLink).not.toBeInTheDocument();
    });

    it('does not render a link when the viewer is zoomed into non-image space (e.g. a reponse the image server cannot handle)', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: -100, y: 100, width: 2000, height: 500,
      }));
      createWrapper({ canvas, infoResponse, windowId: 'zoomedIntoNonImageSpaceWindow' });
      const zoomedLink = screen.queryByText('Zoomed region (2000 x 500px)');
      expect(zoomedLink).not.toBeInTheDocument();
    });

    it('is present when the viewer is zoomed into the image', () => {
      currentBoundsSpy.mockImplementation(() => ({
        x: 0, y: 0, width: 2000, height: 500,
      }));
      createWrapper({ canvas, infoResponse, windowId: 'zoomedInWindow' });
      const zoomedLink = screen.queryByText('Zoomed region (2000 x 500px)');
      expect(zoomedLink).toBeInTheDocument();
    });

    it('is not present when the window is in book or gallery view (only single view)', () => {
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

    describe('when the zoom link is set to be restricted', () => {
      it('has just the whole image link from the sizes and does not present a zoomed region link', () => {
        createWrapper({
          canvas,
          infoResponse: {
            json: {
              width: 4000,
              height: 1000,
              sizes: [{
                width: 400,
                height: 100,
              }],
            },
          },
          restrictDownloadOnSizeDefinition: true,
          windowId: 'zoomedInWindow',
        });
        const links = screen.getByRole('link', { name: /Whole image \(400 x 100px\)/i });
        expect(links).toBeInTheDocument();
      });
    });
  });

  describe('when there is are sizes defined in the infoResponse', () => {
    const sizes = [
      { width: 4000, height: 1000 },
      { width: 2000, height: 500 },
      { width: 1000, height: 250 },
    ];
    it('uses those sizes for links in the download dialog', () => {
      createWrapper({ canvas, infoResponse: { json: { sizes } } });
      const link1 = screen.getByRole('link', { name: /Whole image \(4000 x 1000px\)/i });
      const link2 = screen.getByRole('link', { name: /Whole image \(2000 x 500px\)/i });
      const link3 = screen.getByRole('link', { name: /Whole image \(1000 x 250px\)/i });

      expect(link1).toBeInTheDocument();
      expect(link2).toBeInTheDocument();
      expect(link3).toBeInTheDocument();
    });
  });

  describe('when there are no defined sizes', () => {
    it('renders a link to the whole image', () => {
      createWrapper({ canvas });
      const link = screen.getByRole('link', { name: /Whole image \(4000 x 1000px\)/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'http://example.com/iiif/abc123/full/full/0/default.jpg?download=true');
    });

    describe('when the image is > 1000px wide', () => {
      it('renders a link to a small image (1000px wide), and calculates the correct height', () => {
        createWrapper({ canvas });
        const links = screen.getAllByRole('link');

        expect(links).toBeInTheDocument();

        const link1 = screen.getByRole('link', { name: /Whole image \(4000 x 1000px\)/i });
        expect(link1).toHaveAttribute('href', 'http://example.com/iiif/abc123/full/1000,/0/default.jpg?download=true');

        const link2 = screen.getByRole('link', { name: /Whole image \(1000 x 250px\)/i });
        expect(link2).toHaveAttribute('href', 'http://example.com/iiif/abc123/full/1000,/0/default.jpg?download=true');
      });
    });

    describe('when the image is < 1000px wide', () => {
      it('does not render a link to a small image', () => {
        canvas.getWidth = () => 999;
        createWrapper({ canvas });
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(2);
      });
    });
  });
});
