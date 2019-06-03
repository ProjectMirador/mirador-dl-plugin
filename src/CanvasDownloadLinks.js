import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

/**
 * CanvasDownloadLinks ~
*/
export default class CanvasDownloadLinks extends Component {
  fullImageLabel() {
    const { canvas } = this.props;

    return `Whole image (${canvas.getWidth()} x ${canvas.getHeight()}px)`;
  }

  smallImageLabel() {
    const { canvas } = this.props;

    return `Whole image (1000 x ${Math.floor((1000 * canvas.getHeight()) / canvas.getWidth())}px)`;
  }

  fullImageUrl() {
    const { canvas } = this.props;

    return `${canvas.getCanonicalImageUri().replace(/\/full\/.*\/0\//, '/full/full/0/')}?download=true`;
  }

  thousandPixelWideImage() {
    const { canvas } = this.props;

    return `${canvas.getCanonicalImageUri('1000')}?download=true`;
  }

  /**
   * Returns the rendered component
  */
  render() {
    const {
      canvas,
      canvasLabel,
    } = this.props;
    return (
      <span key={canvas.id}>
        <Typography noWrap variant="h3">{canvasLabel}</Typography>
        <List>
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
      </span>
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
};