import mirador from 'mirador';
import miradorDownloadPlugin from '../../src';
import miradorDownloadDialogPlugin from '../../src/MiradorDownloadDialog';
import osdReferencePlugin from '../../src/OSDReferences';

const config = {
  id: 'demo',
  windows: [{
    loadedManifest: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
  },
  {
    loadedManifest: 'https://scta.info/iiif/graciliscommentary/lon/manifest',
    view: 'book',
    canvasIndex: 3,
  }],
};

mirador.viewer(config, [
  osdReferencePlugin,
  miradorDownloadDialogPlugin,
  miradorDownloadPlugin,
]);
