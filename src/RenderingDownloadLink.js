import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

/**
 * RenderingDownloadLink ~
*/
export default class RenderingDownloadLink extends Component {
  render() {
    const { rendering } = this.props;
    return (
      <ListItem disableGutters divider key={rendering.id}>
        <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
          <Link href={rendering.id} rel="noopener noreferrer" target="_blank" variant="body1">
            {rendering.getLabel().getValue()}
          </Link>
          {rendering.getFormat()
            && rendering.getFormat().value
            && ` (${rendering.getFormat().value})`
          }
        </ListItemText>
      </ListItem>
    );
  }
}

RenderingDownloadLink.propTypes = {
  rendering: PropTypes.shape({
    id: PropTypes.string.isRequired,
    getLabel: PropTypes.func.isRequired,
    getFormat: PropTypes.func.isRequired,
  }).isRequired,
};
