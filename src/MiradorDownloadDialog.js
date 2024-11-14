import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  getCanvasLabel,
  getContainerId,
  getManifestoInstance,
  getVisibleCanvases,
  getWindowViewType,
  selectInfoResponse,
  ScrollIndicatedDialogContent,
  useTranslation,
} from 'mirador';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ManifestDownloadLinks from './ManifestDownloadLinks';
import translations from './translations';
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
export function MiradorDownloadDialog({
  canvases = [],
  canvasLabel,
  closeDialog,
  containerId,
  infoResponse,
  manifest = undefined,
  open = false,
  restrictDownloadOnSizeDefinition = false,
  viewType,
  windowId,
}) {
  const { t } = useTranslation();
  const renderings = useMemo(() => {
    const manifestRenderings = (manifest && manifest.getRenderings()) || [];
    const sequenceRenderings = (manifest
        && manifest.getSequences()
        && manifest.getSequences()[0]
        && manifest.getSequences()[0].getRenderings()) || [];
    return [...manifestRenderings, ...sequenceRenderings];
  }, [manifest]);

  if (!open) return '';

  return (
    <Dialog
      data-testid="dialog-content"
      container={document.querySelector(`#${containerId} .mirador-viewer`)}
      disableEnforceFocus
      onClose={closeDialog}
      open={open}
      scroll="paper"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ paddingBottom: 0 }}>
        <Typography variant="h2" component="span">{t('mirador-dl-plugin.download')}</Typography>
      </DialogTitle>
      <ScrollIndicatedDialogContent>
        {canvases.map((canvas) => {
          const imageInfo = infoResponse(canvas.id);
          const context = imageInfo.json && imageInfo.json['@context'];
          let contextArray;
          if (Array.isArray(context)) {
            contextArray = context;
          } else if (typeof context === 'string') {
            contextArray = [context];
          }
          const fullSizeParam = contextArray && contextArray.indexOf('http://iiif.io/api/image/3/context.json') > -1
            ? 'max' : 'full';

          return (
            <CanvasDownloadLinks
              canvas={canvas}
              canvasLabel={canvasLabel(canvas.id)}
              fullSizeParam={fullSizeParam}
              infoResponse={infoResponse(canvas.id)}
              restrictDownloadOnSizeDefinition={
                  restrictDownloadOnSizeDefinition
                }
              key={canvas.id}
              t={t}
              viewType={viewType}
              windowId={windowId}
            />
          );
        })}
        {renderings.length > 0 && (
          <ManifestDownloadLinks
            renderings={renderings}
            t={t}
          />
        )}
      </ScrollIndicatedDialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          {t('mirador-dl-plugin.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MiradorDownloadDialog.propTypes = {
  canvasLabel: PropTypes.func.isRequired,
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, index: PropTypes.number }),
  ),
  closeDialog: PropTypes.func.isRequired,
  containerId: PropTypes.string.isRequired,
  infoResponse: PropTypes.func.isRequired,
  manifest: PropTypes.shape({
    getSequences: PropTypes.func,
    getRenderings: PropTypes.func,
  }),
  open: PropTypes.bool,
  restrictDownloadOnSizeDefinition: PropTypes.bool,
  viewType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default {
  target: 'Window',
  mode: 'add',
  name: 'MiradorDownloadDialog',
  component: MiradorDownloadDialog,
  config: {
    translations,
  },
  mapDispatchToProps,
  mapStateToProps,
};
