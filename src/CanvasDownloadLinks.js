import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { OSDReferences } from './OSDReferences';


/**
 * CanvasDownloadLinks ~
*/
export default class CanvasDownloadLinks extends Component {
  zoomedImageLabel() {
    const bounds = this.currentBounds();
    return `Zoomed region (${Math.floor(bounds.width)} x ${Math.floor(bounds.height)}px)`;
  }

  fullImageLabel() {
    const { canvas } = this.props;

    return `Whole image (${canvas.getWidth()} x ${canvas.getHeight()}px)`;
  }

  smallImageLabel() {
    const { canvas } = this.props;

    return `Whole image (1000 x ${Math.floor((1000 * canvas.getHeight()) / canvas.getWidth())}px)`;
  }

  zoomedImageUrl() {
    const { canvas } = this.props;
    const bounds = this.currentBounds();

    return canvas.getCanonicalImageUri().replace(
      /\/full\/.*\/0\//,
      `/${bounds.x},${bounds.y},${bounds.width},${bounds.height}/full/0/`,
    );
  }

  fullImageUrl() {
    const { canvas } = this.props;

    return `${canvas.getCanonicalImageUri().replace(/\/full\/.*\/0\//, '/full/full/0/')}?download=true`;
  }

  thousandPixelWideImage() {
    const { canvas } = this.props;

    return `${canvas.getCanonicalImageUri('1000')}?download=true`;
  }

  osdViewport() {
    const { windowId } = this.props;
    return OSDReferences.get(windowId).current.viewer.viewport;
  }

  currentBounds() {
    const bounds = this.osdViewport().getBounds();

    return Object.keys(bounds).reduce((object, key) => {
      object[key] = Math.ceil(bounds[key]); // eslint-disable-line no-param-reassign
      return object;
    }, {});
  }

  displayCurrentZoomLink() {
    const { viewType } = this.props;

    if (viewType === 'book') return false;
    return this.osdViewport().getZoom() > this.osdViewport().getHomeZoom();
  }

  /**
   * Returns the rendered component
  */
  render() {
    const {
      canvas,
      canvasLabel,
      classes,
    } = this.props;

    return (
      <React.Fragment>
        <Typography noWrap variant="h3" className={classes.h3}>{canvasLabel}</Typography>
        <List>
          {this.displayCurrentZoomLink()
            && (
              <ListItem disableGutters divider>
                <Link href={this.zoomedImageUrl()} rel="noopener noreferrer" target="_blank" variant="body1">
                  {this.zoomedImageLabel()}
                </Link>
              </ListItem>
            )
          }
          <ListItem disableGutters divider>
            <Link href={this.fullImageUrl()} rel="noopener noreferrer" target="_blank" variant="body1">
              {this.fullImageLabel()}
            </Link>
          </ListItem>
          {(canvas.getWidth() > 1000)
            && (
            <ListItem disableGutters divider>
              <Link href={this.thousandPixelWideImage()} rel="noopener noreferrer" target="_blank" variant="body1">
                {this.smallImageLabel()}
              </Link>
            </ListItem>
            )
          }
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
    getWidth: PropTypes.func.isRequired,
  }).isRequired,
  canvasLabel: PropTypes.string.isRequired, // canvasLabel is passed because we need access to redux
  classes: PropTypes.shape({
    h3: PropTypes.string,
  }).isRequired,
  viewType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};
