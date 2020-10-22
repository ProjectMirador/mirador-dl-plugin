import Mirador from 'mirador/dist/es/src/index';
import miradorDownloadPlugins from '../../src';

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
  },
  {
    loadedManifest: 'https://digital.library.villanova.edu/Item/vudl:24299/Manifest',
  }],
};

Mirador.viewer(config, [
  ...miradorDownloadPlugins,
]);
