import React from 'react';
import { shallow } from 'enzyme';
import CanvasDownloadLinks from '../src/CanvasDownloadLinks';
import { OSDReferences } from '../src/OSDReferences';

function createWrapper(props) {
  return shallow(
    <CanvasDownloadLinks
      canvasId="abc123"
      canvasLabel="My Canvas Label"
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
  };
  const viewport = {
    getBounds: () => ({
      x: 0, y: 0, width: 4000, height: 1000,
    }),
    getZoom: () => 0.5,
    getHomeZoom: () => 0.5,
  };
  const zoomedInViewport = {
    getBounds: () => ({
      x: 0, y: 0, width: 2000, height: 500,
    }),
    getZoom: () => 1.0,
    getHomeZoom: () => 0.5,
  };

  beforeAll(() => {
    OSDReferences.set('wid123', {
      current: { viewer: { viewport } },
    });
    OSDReferences.set('zoomedInWindow', {
      current: { viewer: { viewport: zoomedInViewport } },
    });
  });

  it('renders canvas label in an h3 typography', () => {
    wrapper = createWrapper({ canvas });
    expect(wrapper.find('WithStyles(Typography)[variant="h3"]').props().children).toEqual('My Canvas Label');
  });

  it('renders a link to the whole image', () => {
    wrapper = createWrapper({ canvas });
    expect(wrapper.find(
      'WithStyles(Link)[href="http://example.com/iiif/abc123/full/full/0/default.jpg?download=true"]',
    ).props().children).toEqual('Whole image (4000 x 1000px)');
  });

  describe('Zoomed image link', () => {
    it('is not present when the current zoom is the same as the home zoom', () => {
      wrapper = createWrapper({ canvas });

      expect(wrapper.find('WithStyles(Link)').length).toBe(2);
    });

    it('is present when zoomed in', () => {
      wrapper = createWrapper({ canvas, windowId: 'zoomedInWindow' });

      expect(wrapper.find('WithStyles(Link)').length).toBe(3);
      expect(wrapper.find(
        'WithStyles(Link)[href="http://example.com/iiif/abc123/0,0,2000,500/full/0/default.jpg"]',
      ).props().children).toEqual('Zoomed image (2000 x 500px)');
    });
  });

  describe('when the image is > 1000px wide', () => {
    it('renders a link to a small image (1000px wide), and calculates the correct height', () => {
      wrapper = createWrapper({ canvas });
      expect(wrapper.find('WithStyles(Link)').length).toEqual(2);
      expect(wrapper.find(
        'WithStyles(Link)[href="http://example.com/iiif/abc123/full/1000,/0/default.jpg?download=true"]',
      ).length).toEqual(1);
      expect(wrapper.find(
        'WithStyles(Link)[href="http://example.com/iiif/abc123/full/1000,/0/default.jpg?download=true"]',
      ).props().children).toEqual('Whole image (1000 x 250px)');
    });
  });

  describe('when the image is < 1000px wide', () => {
    it('does not render a link to a small image', () => {
      canvas.getWidth = () => 999;
      wrapper = createWrapper({ canvas });
      expect(wrapper.find('WithStyles(Link)').length).toEqual(1); // Does not include the 2nd link
    });
  });
});
