module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'MiradorDownload',
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  },
};
