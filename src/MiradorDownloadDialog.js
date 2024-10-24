import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  getCanvasLabel,
  getVisibleCanvases,
  selectInfoResponse,
} from 'mirador/dist/es/src/state/selectors/canvases';
import { getWindowViewType } from 'mirador/dist/es/src/state/selectors/windows';
import { getManifestoInstance } from 'mirador/dist/es/src/state/selectors/manifests';
import { getContainerId } from 'mirador/dist/es/src/state/selectors/config';
import ScrollIndicatedDialogContent from 'mirador/dist/es/src/containers/ScrollIndicatedDialogContent';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ManifestDownloadLinks from './ManifestDownloadLinks';
import CanvasDownloadLinks from './CanvasDownloadLinks';

const mapDispatchToProps = (dispatch, { windowId }) => ({
  closeDialog: () => dispatch({ type: 'CLOSE_WINDOW_DIALOG', windowId }),
});

const mapStateToProps = (state, { windowId }) => ({
  canvases: getVisibleCanvases(state, { windowId }),
  canvasLabel: (canvasId) => getCanvasLabel(state, { canvasId, windowId }),
  containerId: getContainerId(state),
  infoResponse: (canvasId) => selectInfoResponse(state, { windowId, canvasId }) || {},
  manifest: getManifestoInstance(state, { windowId }),
  restrictDownloadOnSizeDefinition:
    state.config.miradorDownloadPlugin
    && state.config.miradorDownloadPlugin.restrictDownloadOnSizeDefinition,
  open:
    state.windowDialogs[windowId]
    && state.windowDialogs[windowId].openDialog === 'download',
  viewType: getWindowViewType(state, { windowId }),
});

/**
 * MiradorDownloadDialog ~
 */
export class MiradorDownloadDialog extends Component {
  renderings() {
    const { manifest } = this.props;
    if (
      !(
        manifest
        && manifest.getSequences()
        && manifest.getSequences()[0]
        && manifest.getSequences()[0].getRenderings()
      )
    ) return [];

    return manifest.getSequences()[0].getRenderings();
  }

  /**
   * Returns the rendered component
   */
  render() {
    const {
      canvases,
      canvasLabel,
      classes,
      closeDialog,
      containerId,
      infoResponse,
      open,
      restrictDownloadOnSizeDefinition,
      viewType,
      windowId,
    } = this.props;

    if (!open) return '';

    return (
      <Dialog
        container={document.querySelector(`#${containerId} .mirador-viewer`)}
        disableEnforceFocus
        onClose={closeDialog}
        open={open}
        scroll="paper"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ paddingBottom: 0 }}>
          <Typography variant="h2" component="span">Download</Typography>
        </DialogTitle>
        <ScrollIndicatedDialogContent>
          {canvases.map((canvas) => (
            <CanvasDownloadLinks
              canvas={canvas}
              canvasLabel={canvasLabel(canvas.id)}
              infoResponse={infoResponse(canvas.id)}
              restrictDownloadOnSizeDefinition={
                  restrictDownloadOnSizeDefinition
                }
              key={canvas.id}
              viewType={viewType}
              windowId={windowId}
            />
          ))}
          {this.renderings().length > 0 && (
          <ManifestDownloadLinks
            classes={classes}
            renderings={this.renderings()}
          />
          )}
        </ScrollIndicatedDialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

MiradorDownloadDialog.propTypes = {
  canvasLabel: PropTypes.func.isRequired,
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, index: PropTypes.number }),
  ),
  classes: PropTypes.shape({
    h2: PropTypes.string,
  }).isRequired,
  closeDialog: PropTypes.func.isRequired,
  containerId: PropTypes.string.isRequired,
  infoResponse: PropTypes.func.isRequired,
  manifest: PropTypes.shape({
    getSequences: PropTypes.func,
  }),
  open: PropTypes.bool,
  restrictDownloadOnSizeDefinition: PropTypes.bool,
  viewType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};
MiradorDownloadDialog.defaultProps = {
  canvases: [],
  manifest: {},
  open: false,
  restrictDownloadOnSizeDefinition: false,
};

export default {
  target: 'Window',
  mode: 'add',
  name: 'MiradorDownloadDialog',
  component: MiradorDownloadDialog,
  mapDispatchToProps,
  mapStateToProps,
};
