import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Box';

import TimeControlButton from './editorComponents/TimeControlButton.jsx';

export default function LayerEditorCopy(props) {
  const player = props.layerPlayer;
  const waveform = props.waveform;
  const [isSolo, setIsSolo] = useState(props.solo.solo);
  const [isMuted, setIsMuted] = useState(props.layerPlayer.mute);
  const [duration, setDuration] = useState(false);
  const [pitchSliderValue, setPitchSliderValue] = useState(props.pitch);
  const [volumeSliderValue, setVolumeSliderValue] = useState(props.volume);
  const pitchShift = props.pitchShift;
  const layerVolume = props.layerVolume;
  const solo = props.solo;
  // put page on mousedown listener to get the duration of tracks then immediatly remove it after setting each tracks duration.
  useEffect(() => {
    const mouse = async () => {
      await Tone.start();
      setDuration(player._buffer.duration);
    };

    if (!duration) {
      document.documentElement.addEventListener('mousedown', mouse);
    }
    return () => {
      document.documentElement.removeEventListener('mousedown', mouse);
    };
  }, [duration]);

  const changeVolumeValue = (event, newValue) => {
    setVolumeSliderValue(newValue);
    layerVolume.volume.value = newValue;
  };

  const changePitchValue = (event, newValue) => {
    setPitchSliderValue(newValue);
    pitchShift.pitch = newValue;
  };

  const muteLayer = () => {
    setIsMuted(!isMuted);
    player.mute = !isMuted;
  };
  const soloLayer = () => {
    setIsSolo(!isSolo);
    solo.solo = !isSolo;
  };

  // editor modal handlers
  const [editOpen, setEditOpen] = React.useState(false);
  const layerEditorOpen = () => {
    setEditOpen(true);
  };
  const layerEditClose = () => {
    setEditOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: { xs: '13vh', md: '16vh' },
          maxHeight: { xs: '13vh', md: '16vh' },
          border: '1px, solid, black',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 4fr',
        }}>
        <FormControlLabel
          sx={{ gridRow: '1', gridColumn: '1' }}
          label={props.layerData.layerName}
          control={<Checkbox defaultChecked />}
        />
        <Box sx={{ gridRow: '1', gridColumn: '2', maxWidth: '25vh' }}>
          <TimeControlButton
            button={{ name: 'Mute', handler: muteLayer, value: isMuted }}
          />
          <TimeControlButton
            button={{ name: 'Solo', handler: soloLayer, value: isSolo }}
          />
          <TimeControlButton
            button={{ name: 'Edit', handler: layerEditorOpen }}
          />
        </Box>
      </Box>
      <Box sx={{ gridRow: '1', gridColumn: '3', maxWidth: '40vh' }}>
        <canvas
          className={'visual-layer' + props.id}
          width='350'
          height='75'></canvas>
      </Box>

      <Modal
        open={editOpen}
        onClose={layerEditClose}
        aria-label='modal-edit-title'>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', md: 400 },
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
          <Typography variant='subtitle2' id='modal-edit-title'>
            Edit Layer: {props.layerData.layerName}
          </Typography>
          <Typography>Volume</Typography>
          <Slider
            min={-20}
            max={20}
            value={volumeSliderValue}
            onChange={changeVolumeValue}
            aria-label='Volume Slider'
            valueLabelDisplay='auto'
          />
          <Typography>Pitch</Typography>
          <Slider
            min={0}
            max={12}
            value={pitchSliderValue}
            onChange={changePitchValue}
            aria-label='Pitch Slider'
            valueLabelDisplay='auto'
          />
        </Box>
      </Modal>
    </>
  );
}