import {render} from 'react-dom'

import mirador from 'mirador';
import { miradorDownloadPlugin } from '../../src';

const config = {
  id: 'demo',
  windows: [{
    loadedManifest: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest'
  }]
}

const miradorInstance = mirador.viewer(config, [
  miradorDownloadPlugin,
]);
