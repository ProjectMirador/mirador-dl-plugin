import React from 'react';
import PropTypes from 'prop-types';

export const OSDReferences = {
  refs: {},
  get(windowId) {
    return this.refs[windowId];
  },

  set(windowId, ref) {
    this.refs[windowId] = ref;
  },
};


class OSDReferenceComponent extends React.Component {
  constructor(props) {
    super(props);
    const { windowId } = props.targetProps;
    this.osdRef = React.createRef();
    OSDReferences.set(windowId, this.osdRef);
  }

  render() {
    const { targetProps } = this.props;

    return <this.props.TargetComponent {...targetProps} ref={this.osdRef} />;
  }
}

OSDReferenceComponent.propTypes = {
  targetProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default {
  name: 'OSD Reference',
  target: 'OpenSeadragonViewer',
  mode: 'wrap',
  component: OSDReferenceComponent,
};
