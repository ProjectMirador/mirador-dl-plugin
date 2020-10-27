import React from 'react';
import { shallow } from 'enzyme';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import CanvasDownloadLinks from '../src/CanvasDownloadLinks';
import RenderingDownloadLink from '../src/RenderingDownloadLink';

function createWrapper(props) {
  return shallow(
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
  let wrapper;
  const canvas = {
    id: 'abc123',
    getCanonicalImageUri: width => (
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
  const viewport = {
    getBounds: () => ({
      x: 0, y: 0, width: 4000, height: 1000,
    }),
  };
  const zoomedInViewport = {
    getBounds: () => ({
      x: 0, y: 0, width: 2000, height: 500,
    }),
  };

  const zoomedOutViewport = {
    getBounds: () => ({
      x: 0, y: 0, width: 6000, height: 1000,
    }),
  };

  const zoomedIntoNonImageSpaceViewport = {
    getBounds: () => ({
      x: -100, y: 100, width: 2000, height: 500,
    }),
  };

  beforeAll(() => {
    OSDReferences.set('wid123', {
      current: { viewport },
    });
    OSDReferences.set('zoomedInWindow', {
      current: { viewport: zoomedInViewport },
    });
    OSDReferences.set('zoomedOutWindow', {
      current: { viewport: zoomedOutViewport },
    });
    OSDReferences.set('zoomedIntoNonImageSpaceWindow', {
      current: { viewport: zoomedIntoNonImageSpaceViewport },
    });
  });

  it('renders canvas label in an h3 typography', () => {
    wrapper = createWrapper({ canvas });
    expect(
      wrapper.find(Typography)
        .find({ variant: 'h3' })
        .props().children,
    ).toEqual('My Canvas Label');
  });

  it('renders canvas level renderings', () => {
    wrapper = createWrapper({ canvas });
    expect(
      wrapper.find(RenderingDownloadLink).length,
    ).toEqual(1);
  });

  describe('Zoomed region link', () => {
    const infoResponse = {
      json: { width: 4000, height: 1000 },
    };

    it('it does not render a link when the viewer is zoomed out/at the entire image', () => {
      wrapper = createWrapper({ canvas, infoResponse, windowId: 'zoomedOutWindow' });
      expect(wrapper.find(Link).length).toBe(2);

      wrapper = createWrapper({ canvas, infoResponse, windowId: 'wid123' });
      expect(wrapper.find(Link).length).toBe(2);
    });

    it('does not render a link when the viewer is zoomed into non-image space (e.g. a reponse the image server cannot handle)', () => {
      wrapper = createWrapper({ canvas, infoResponse, windowId: 'zoomedIntoNonImageSpaceWindow' });

      expect(wrapper.find(Link).length).toBe(2);
    });

    it('is present when the viewer is zoomed into the image', () => {
      wrapper = createWrapper({ canvas, infoResponse, windowId: 'zoomedInWindow' });

      expect(wrapper.find(Link).length).toBe(3);
      expect(
        wrapper
          .find(Link)
          .find({ href: 'http://example.com/iiif/abc123/0,0,2000,500/full/0/default.jpg?download=true' })
          .props().children,
      ).toEqual('Zoomed region (2000 x 500px)');
    });

    it('is not present when the window is in book or gallery view (only single view)', () => {
      wrapper = createWrapper({
        canvas, infoResponse, viewType: 'book', windowId: 'zoomedInWindow',
      });

      expect(wrapper.find(Link).length).toBe(2);

      wrapper = createWrapper({
        canvas, infoResponse, viewType: 'gallery', windowId: 'zoomedInWindow',
      });

      expect(wrapper.find(Link).length).toBe(2);
    });

    describe('when the zoom link is set to be restricted', () => {
      it('has just the whole image link from the sizes and does not present a zoomed region link', () => {
        wrapper = createWrapper({
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

        expect(wrapper.find(Link).length).toBe(1);
        expect(wrapper.find(Link).props().children).toEqual('Whole image (400 x 100px)');
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
      wrapper = createWrapper({ canvas, infoResponse: { json: { sizes } } });

      // console.log(wrapper.debug());
      expect(wrapper.find(Link).at(0).props().children).toEqual('Whole image (4000 x 1000px)');
      expect(wrapper.find(Link).at(1).props().children).toEqual('Whole image (2000 x 500px)');
      expect(wrapper.find(Link).at(2).props().children).toEqual('Whole image (1000 x 250px)');
    });
  });

  describe('when there are no defined sizes', () => {
    it('renders a link to the whole image', () => {
      wrapper = createWrapper({ canvas });
      expect(
        wrapper
          .find(Link)
          .find({ href: 'http://example.com/iiif/abc123/full/full/0/default.jpg?download=true' })
          .props()
          .children,
      ).toEqual('Whole image (4000 x 1000px)');
    });

    describe('when the image is > 1000px wide', () => {
      it('renders a link to a small image (1000px wide), and calculates the correct height', () => {
        wrapper = createWrapper({ canvas });
        expect(wrapper.find(Link).length).toEqual(2);
        expect(
          wrapper
            .find(Link)
            .find({ href: 'http://example.com/iiif/abc123/full/1000,/0/default.jpg?download=true' })
            .length,
        ).toEqual(1);
        expect(
          wrapper
            .find(Link)
            .find({ href: 'http://example.com/iiif/abc123/full/1000,/0/default.jpg?download=true' })
            .props().children,
        ).toEqual('Whole image (1000 x 250px)');
      });
    });

    describe('when the image is < 1000px wide', () => {
      it('does not render a link to a small image', () => {
        canvas.getWidth = () => 999;
        wrapper = createWrapper({ canvas });
        expect(wrapper.find(Link).length).toEqual(1); // Does not include the 2nd link
      });
    });
  });
});
