import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import RenderingDownloadLink from './RenderingDownloadLink';

/**
 * CanvasDownloadLinks ~
 */
export default class CanvasDownloadLinks extends Component {
  zoomedImageLabel() {
    const bounds = this.currentBounds();
    return `Zoomed region (${Math.floor(bounds.width)} x ${Math.floor(
      bounds.height,
    )}px)`;
  }

  fullImageLabel() {
    const { canvas } = this.props;

    return `Whole image (${canvas.getWidth()} x ${canvas.getHeight()}px)`;
  }

  smallImageLabel() {
    const { canvas } = this.props;

    return `Whole image (1000 x ${Math.floor(
      (1000 * canvas.getHeight()) / canvas.getWidth(),
    )}px)`;
  }

  zoomedImageUrl() {
    const { canvas, isVersion3 } = this.props;
    const bounds = this.currentBounds();
    const boundsUrl = canvas
      .getCanonicalImageUri()
      .replace(
        /\/full\/.*\/0\//,
        `/${bounds.x},${bounds.y},${bounds.width},${bounds.height}/${isVersion3 ? `${bounds.width},${bounds.height}` : 'full'}/0/`,
      );

    return `${boundsUrl}?download=true`;
  }

  imageUrlForSize(size) {
    const { canvas, isVersion3 } = this.props;

    return isVersion3 ? `${canvas.getCanonicalImageUri().replace(/\/full\/.*\/0\//, `/full/${size.width},${size.height}/0/`)}?download=true`
      : `${canvas.getCanonicalImageUri(size.width)}?download=true`;
  }

  fullImageUrl() {
    const { canvas, isVersion3 } = this.props;

    return `${canvas
      .getCanonicalImageUri()
      .replace(/\/full\/.*\/0\//, `/full/${isVersion3 ? 'max' : 'full'}/0/`)}?download=true`;
  }

  thousandPixelWideImage() {
    const { canvas } = this.props;

    return `${canvas.getCanonicalImageUri('1000')}?download=true`;
  }

  osdViewport() {
    const { windowId } = this.props;

    return OSDReferences.get(windowId).current.viewport;
  }

  currentBounds() {
    const bounds = this.osdViewport().getBounds();

    return Object.keys(bounds).reduce((object, key) => {
      object[key] = Math.ceil(bounds[key]); // eslint-disable-line no-param-reassign
      return object;
    }, {});
  }

  definedSizesRestrictsDownload() {
    const { infoResponse } = this.props;
    if (!infoResponse.json) return false;
    const { height, width } = infoResponse.json;

    if (this.definedSizes().length !== 1) return false;

    return (
      this.definedSizes()[0].width <= width
      && this.definedSizes()[0].height <= height
    );
  }

  displayCurrentZoomLink() {
    const { restrictDownloadOnSizeDefinition, infoResponse, viewType } = this.props;

    if (viewType !== 'single') return false;
    if (
      restrictDownloadOnSizeDefinition
      && this.definedSizesRestrictsDownload()
    ) return false;
    if (!(infoResponse && infoResponse.json)) return false;

    const bounds = this.currentBounds();
    return (
      bounds.height < infoResponse.json.height
      && bounds.width < infoResponse.json.width
      && bounds.x >= 0
      && bounds.y >= 0
    );
  }

  /**
   * This only returns unique sizes
   */
  definedSizes() {
    const { infoResponse } = this.props;
    if (!(infoResponse && infoResponse.json && infoResponse.json.sizes)) return [];

    return uniqBy(
      infoResponse.json.sizes,
      (size) => `${size.width}${size.height}`,
    );
  }

  fullImageLink() {
    return (
      <ListItem disableGutters divider key={this.fullImageUrl()}>
        <Link
          href={this.fullImageUrl()}
          rel="noopener noreferrer"
          target="_blank"
          variant="body1"
        >
          {this.fullImageLabel()}
        </Link>
      </ListItem>
    );
  }

  thousandPixelWideLink() {
    const { canvas } = this.props;

    if (canvas.getWidth() < 1000) return '';

    return (
      <ListItem disableGutters divider key={this.thousandPixelWideImage()}>
        <Link
          href={this.thousandPixelWideImage()}
          rel="noopener noreferrer"
          target="_blank"
          variant="body1"
        >
          {this.smallImageLabel()}
        </Link>
      </ListItem>
    );
  }

  linksForDefinedSizes() {
    return this.definedSizes().map((size) => (
      <ListItem disableGutters divider key={`${size.width}${size.height}`}>
        <Link
          href={this.imageUrlForSize(size)}
          rel="noopener noreferrer"
          target="_blank"
          variant="body1"
        >
          {`Whole image (${size.width} x ${size.height}px)`}
        </Link>
      </ListItem>
    ));
  }

  /**
   * Returns the rendered component
   */
  render() {
    const { canvas, canvasLabel } = this.props;

    return (
      <React.Fragment>
        <Typography noWrap variant="h3" sx={{ marginTop: '20px' }}>
          {canvasLabel}
        </Typography>
        <List>
          {this.displayCurrentZoomLink() && (
            <ListItem disableGutters divider>
              <Link
                href={this.zoomedImageUrl()}
                download
                rel="noopener noreferrer"
                target="_blank"
                variant="body1"
              >
                {this.zoomedImageLabel()}
              </Link>
            </ListItem>
          )}
          {this.definedSizes().length === 0 && [
            this.fullImageLink(),
            this.thousandPixelWideLink(),
          ]}
          {this.definedSizes().length > 0 && this.linksForDefinedSizes()}
          {canvas.getRenderings().map((rendering) => (
            <RenderingDownloadLink rendering={rendering} key={rendering.id} />
          ))}
        </List>
      </React.Fragment>
    );
  }
}

CanvasDownloadLinks.propTypes = {
  canvas: PropTypes.shape({
    id: PropTypes.string.isRequired,
    getCanonicalImageUri: PropTypes.func.isRequired,
    getHeight: PropTypes.func.isRequired,
    getRenderings: PropTypes.func.isRequired,
    getWidth: PropTypes.func.isRequired,
  }).isRequired,
  canvasLabel: PropTypes.string.isRequired, // canvasLabel is passed because we need access to redux
  infoResponse: PropTypes.shape({
    json: PropTypes.shape({
      height: PropTypes.number,
      sizes: PropTypes.arrayOf(
        PropTypes.shape({ height: PropTypes.number, width: PropTypes.number }),
      ),
      width: PropTypes.number,
    }),
  }).isRequired,
  isVersion3: PropTypes.bool.isRequired,
  restrictDownloadOnSizeDefinition: PropTypes.bool.isRequired,
  viewType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};
