import Mirador from 'mirador/dist/es/src/index';
import OSDReferencesPlugin from 'mirador/dist/es/src/plugins/OSDReferences';
import miradorDownloadPlugin from '../../src/miradorDownloadPlugin';
import miradorDownloadDialogPlugin from '../../src/MiradorDownloadDialog';

const config = {
  id: 'demo',
  miradorDownloadPlugin: {
    restrictDownloadOnSizeDefinition: true,
  },
  windows: [{
    loadedManifest: 'https://purl.stanford.edu/bb020ty1503/iiif/manifest',
  },
  {
    loadedManifest: 'https://scta.info/iiif/graciliscommentary/lon/manifest',
    view: 'book',
    canvasIndex: 3,
  },
  {
    loadedManifest: 'https://purl.stanford.edu/xh756kf1140/iiif/manifest',
  }],
};

Mirador.viewer(config, [
  OSDReferencesPlugin,
  miradorDownloadPlugin,
  miradorDownloadDialogPlugin,
]);
