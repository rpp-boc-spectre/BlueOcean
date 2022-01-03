import React from 'react';

import TimeControlButton from './TimeControlButton.jsx';

import { Box, Button, Checkbox, FormControlLabel, Modal, Slider, Typography } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



const DisplayEntry = (props) => {
  // console.log('ENTRY PROPS', props);
  const layerPlayHandler = () => {
    console.log('Playing ' + props.layer.name);
  };

  const layerStopHandler = () => {
    console.log('Stopping ' + props.layer.name);
  };

  const [editOpen, setEditOpen] = React.useState(false);
  const layerEditorOpen = () => {
    setEditOpen(true);
  };
  const layerEditClose = () => {
    setEditOpen(false);
  }

  // put current saved/stateful value here       v
  const [volValue, setVolValue] = React.useState(30);
  const handleVolChange = (event, newValue) => {
    setVolValue(newValue);
  };

  // put current saved/stateful value here           v
  const [pitchValue, setPitchValue] = React.useState(30);
  const handlePitchChange = (event, newValue) => {
    setPitchValue(newValue);
  };

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const layerDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const layerDeleteClose = () => {
    setDeleteOpen(false);
  }
  const layerDeleteHandler = () => {
    console.log('Deleting ' + props.layer.name);
    setDeleteOpen(false);
  }

  return (
    <>
      <Box
        sx={{
          minHeight: {xs: '13vh', md: '16vh'},
          maxHeight: {xs: '13vh', md: '16vh'},
          border: '1px, solid, black',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 4fr',
        }}
      >
        <FormControlLabel
          sx={{gridRow: '1', gridColumn: '1'}}
          label={props.layer.name}
          control={<Checkbox defaultChecked />}
        />
        <Box sx={{gridRow: '1', gridColumn: '2', maxWidth: '25vh'}}>
          <TimeControlButton button={{name: 'Play', handler: layerPlayHandler}}/>
          <TimeControlButton button={{name: 'Stop', handler: layerStopHandler}}/>
          <TimeControlButton button={{name: 'Edit', handler: layerEditorOpen}} />
          <TimeControlButton button={{name: 'Delete', handler: layerDeleteOpen}} />
        </Box>
      </Box>

      <Modal
        open={editOpen}
        onClose={layerEditClose}
        aria-label='modal-edit-title'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {xs: '95%', md: 400},
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='subtitle2' id='modal-edit-title'>Edit Layer: {props.layer.name}</Typography>
          <Typography>Volume</Typography>
          <Slider
            value={typeof volValue === 'number' ? volValue : 0}
            onChange={handleVolChange}
            aria-label='Volume Slider'
          />
          <Typography>Pitch</Typography>
          <Slider
            value={typeof pitchValue === 'number' ? pitchValue : 0}
            onChange={handlePitchChange}
            aria-label='Pitch Slider'
          />
        </Box>
      </Modal>

      <Dialog
        open={deleteOpen}
        onClose={layerDeleteClose}
        aria-labelledby='alert-delete-title'
        aria-describedby='alert-delete-description'
      >
        <DialogTitle id='alert-delete-title'>{"Delete Layer?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-delete-description'>
            Remove this layer from current track? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={layerDeleteClose}>Keep Layer</Button>
          <Button onClick={layerDeleteHandler} autoFocus >Delete Layer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DisplayEntry;