import React, { Component } from 'react';

class MiradorDownload extends Component {
  render() {
    return (
      <div>
        <h2>Download</h2>
      </div>
    );
  }
}

export default {
  target: 'WindowTopMenu',
  mode: 'add',
  component: MiradorDownload,
};
