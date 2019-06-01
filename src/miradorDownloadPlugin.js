import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import DownloadIcon from '@material-ui/icons/VerticalAlignBottomSharp';
import { getCanvasLabel, getSelectedCanvases } from 'mirador/dist/es/src/state/selectors/canvases';
import CanvasDownloadLinks from './CanvasDownloadLinks';

const mapStateToProps = (state, { windowId }) => ({
  canvases: getSelectedCanvases(state, { windowId }),
  canvasLabel: canvasIndex => (getCanvasLabel(state, { canvasIndex, windowId })),
});

class MiradorDownload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalDisplayed: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  handleClick() {
    const { modalDisplayed } = this.state;
    this.setState({ modalDisplayed: !modalDisplayed });
  }

  handleDialogClose() {
    this.setState({ modalDisplayed: false });
  }

  render() {
    const { canvases, canvasLabel } = this.props;
    const { modalDisplayed } = this.state;
    return (
      <div>
        <MenuItem onClick={this.handleClick}>
          <DownloadIcon />
          <ListItemText inset primaryTypographyProps={{ variant: 'body1' }}>
            Download
          </ListItemText>
        </MenuItem>
        <Dialog
          disableEnforceFocus
          onClose={this.handleDialogClose}
          open={modalDisplayed}
          scroll="paper"
        >
          <DialogTitle disableTypography>
            <Typography variant="h2">Download</Typography>
          </DialogTitle>
          <DialogContent>
            {canvases.map(canvas => (
              <CanvasDownloadLinks
                canvas={canvas}
                canvasLabel={canvasLabel(canvas.index)}
                key={canvas.id}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

MiradorDownload.propTypes = {
  canvasLabel: PropTypes.func.isRequired,
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, index: PropTypes.number }),
  ).isRequired,
};


export default {
  target: 'WindowTopMenu',
  mode: 'add',
  component: MiradorDownload,
  mapStateToProps,
};
