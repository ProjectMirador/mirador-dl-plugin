import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import RenderingDownloadLink from './RenderingDownloadLink';

/**
 * ManifestDownloadLinks ~
 */
export default class ManifestDownloadLinks extends Component {
  /**
   * Returns the rendered component
   */
  render() {
    const { renderings, t } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h3" sx={{ marginTop: '20px' }}>
          {t('other_download')}
        </Typography>
        <List>
          {renderings.map((rendering) => (
            <RenderingDownloadLink rendering={rendering} key={rendering.id} />
          ))}
        </List>
      </React.Fragment>
    );
  }
}

ManifestDownloadLinks.propTypes = {
  renderings: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  t: PropTypes.func.isRequired,
};
