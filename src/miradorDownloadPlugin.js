import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import DownloadIcon from '@material-ui/icons/VerticalAlignBottomSharp';
import translations from './translations';

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

class MiradorDownload extends Component {
  openDialogAndCloseMenu() {
    const { handleClose, openDownloadDialog } = this.props;

    openDownloadDialog();
    handleClose();
  }

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <MenuItem onClick={() => this.openDialogAndCloseMenu()}>
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
            {t('download')}
          </ListItemText>
        </MenuItem>
      </React.Fragment>
    );
  }
}

MiradorDownload.propTypes = {
  handleClose: PropTypes.func,
  openDownloadDialog: PropTypes.func,
  t: PropTypes.func.isRequired,
};

MiradorDownload.defaultProps = {
  handleClose: () => {},
  openDownloadDialog: () => {},
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
