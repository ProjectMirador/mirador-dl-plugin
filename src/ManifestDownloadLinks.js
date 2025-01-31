import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import RenderingDownloadLink from './RenderingDownloadLink';

/**
 * ManifestDownloadLinks ~
 */
export default function ManifestDownloadLinks({ renderings }) {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h3" sx={{ marginTop: '20px' }}>
        {t('mirador-dl-plugin.other_download')}
      </Typography>
      <List>
        {renderings.map((rendering) => (
          <RenderingDownloadLink rendering={rendering} key={rendering.id} />
        ))}
      </List>
    </>
  );
}

ManifestDownloadLinks.propTypes = {
  renderings: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};
