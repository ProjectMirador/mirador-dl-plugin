import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

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
            <ListItem disableGutters divider key={rendering.id}>
              <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
                <Link href={rendering.id} rel="noopener noreferrer" target="_blank" variant="body1">
                  {rendering.getLabel().map(label => label.value)[0]}
                </Link>
                {rendering.getFormat()
                  && rendering.getFormat().value
                  && ` (${rendering.getFormat().value})`
                }
              </ListItemText>
            </ListItem>
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
  renderings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      getLabel: PropTypes.func.isRequired,
      getFormat: PropTypes.func.isRequired,
    }),
  ).isRequired,
};
