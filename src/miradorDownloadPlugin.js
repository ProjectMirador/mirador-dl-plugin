import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'mirador';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import translations from './translations';

// eslint-disable-next-line default-param-last
const downloadDialogReducer = (state = {}, action) => {
  if (action.type === 'OPEN_WINDOW_DIALOG') {
    return {
      ...state,
      [action.windowId]: {
        openDialog: action.dialogType,
      },
    };
  }

  if (action.type === 'CLOSE_WINDOW_DIALOG') {
    return {
      ...state,
      [action.windowId]: {
        openDialog: null,
      },
    };
  }
  return state;
};

const mapDispatchToProps = (dispatch, { windowId }) => ({
  openDownloadDialog: () => dispatch({ type: 'OPEN_WINDOW_DIALOG', windowId, dialogType: 'download' }),
});

function MiradorDownload({ handleClose = () => {}, openDownloadDialog = () => {} }) {
  const openDialogAndCloseMenu = useCallback(() => {
    openDownloadDialog();
    handleClose();
  }, [handleClose, openDownloadDialog]);

  const { t } = useTranslation();

  return (
    <MenuItem onClick={openDialogAndCloseMenu}>
      <ListItemIcon>
        <VerticalAlignBottomIcon />
      </ListItemIcon>
      <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
        {t('mirador-dl-plugin.download')}
      </ListItemText>
    </MenuItem>
  );
}

MiradorDownload.propTypes = {
  handleClose: PropTypes.func,
  openDownloadDialog: PropTypes.func,
};

export default {
  target: 'WindowTopBarPluginMenu',
  mode: 'add',
  name: 'MiradorDownloadPlugin',
  component: MiradorDownload,
  config: {
    translations,
  },
  mapDispatchToProps,
  reducers: {
    windowDialogs: downloadDialogReducer,
  },
};
