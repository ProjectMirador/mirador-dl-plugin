import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import RenderingDownloadLink from './RenderingDownloadLink';

/**
 * ManifestDownloadLinks ~
*/
export default class ManifestDownloadLinks extends Component {
  /**
   * Returns the rendered component
  */
  render() {
    const { classes, renderings } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h3" className={classes.h3}>Other download options</Typography>
        <List>
          {renderings.map(rendering => (
            <RenderingDownloadLink rendering={rendering} key={rendering.id} />
          ))}
        </List>
      </React.Fragment>
    );
  }
}

ManifestDownloadLinks.propTypes = {
  classes: PropTypes.shape({
    h3: PropTypes.string,
  }).isRequired,
  renderings: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};
