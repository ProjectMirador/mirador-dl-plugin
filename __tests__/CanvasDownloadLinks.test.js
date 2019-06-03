import React from 'react';
import { shallow } from 'enzyme';
import CanvasDownloadLinks from '../src/CanvasDownloadLinks';

function createWrapper(props) {
  return shallow(
    <CanvasDownloadLinks
      canvasId="abc123"
      canvasLabel="My Canvas Label"
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
