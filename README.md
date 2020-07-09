# mirador-dl-plugin

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

`mirador-dl-plugin` is a Mirador 3 plugin that adds manifest-provided download links (e.g. `rendering`) to the window options menu. A [live demo](https://mirador-download-plugin.netlify.app/) with several institutions' manifests is available for testing.

![download option in menu](https://user-images.githubusercontent.com/5402927/87057974-5e665a80-c1bc-11ea-8f10-7b783bdc972f.png)

![mirador-download-options](https://user-images.githubusercontent.com/5402927/87057857-3d056e80-c1bc-11ea-8860-7662208c19fa.png)


[build-badge]: https://img.shields.io/travis/projectmirador/mirador-dl-plugin/master.png?style=flat-square
[build]: https://travis-ci.org/projectmirador/mirador-dl-plugin

[npm-badge]: https://img.shields.io/npm/v/mirador-dl-plugin.png?style=flat-square
[npm]: https://www.npmjs.org/package/mirador-dl-plugin

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

## Installation

`mirador-dl-plugin` requires an instance of Mirador 3. See the [Mirador wiki](https://github.com/ProjectMirador/mirador/wiki) for examples of embedding Mirador within an application and additional information about plugins. See the [live demo's index.js](https://github.com/ProjectMirador/mirador-dl-plugin/blob/master/demo/src/index.js) for an example of importing and configuring `mirador-dl-plugin`.

## Configuration

Configurations for this plugin are injected when Mirador is initialized under the `miradorDownloadPlugin` key.

```js
...
  id: 'mirador',
  miradorDownloadPlugin: {
    ...
  }
...
```

| Config Key | Type | Description |
| --- | --- | --- |
| `restrictDownloadOnSizeDefinition` | boolean (default: false) | If set to true the `Zoomed region` link will not be rendered if the image API returns a single size in the `sizes` section and the single size height/width is the same size or smaller than the reported height/width. |

## Contribute
Mirador's development, design, and maintenance is driven by community needs and ongoing feedback and discussion. Join us at our regularly scheduled community calls, on [IIIF slack #mirador](http://bit.ly/iiif-slack), or the [mirador-tech](https://groups.google.com/forum/#!forum/mirador-tech) and [iiif-discuss](https://groups.google.com/forum/#!forum/iiif-discuss) mailing lists. To suggest features, report bugs, and clarify usage, please submit a GitHub issue.
