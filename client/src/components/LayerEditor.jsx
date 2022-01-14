import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Box';
import { useLayerStore } from '../context/LayerContext.js';

import TimeControlButton from './editorComponents/TimeControlButton.jsx';

export default function LayerEditorCopy({ id, player }) {
  const [layerStore, dispatch] = useLayerStore();
  // const player = layerStore.player.layers[id];
  const [isSolo, setIsSolo] = useState(player._solo);
  const [isMuted, setIsMuted] = useState(player._mute);
  const [duration, setDuration] = useState(false);
  const [volumeSliderValue, setVolumeSliderValue] = useState(
    Math.abs(Math.round(-40 - player._volume))
  );
  const [trimFromStart, setTrimFromStart] = useState(player.trimFromStart);
  const [trimFromEnd, setTrimFromEnd] = useState(player.trimFromEnd);
  const [playerPlaybackRate, setPlayerPlaybackRate] = useState(
    player.playbackRate
  );
  const [playerDetune, setPlayerDetune] = useState(player.player.detune / 100);

  // put page on mousedown listener to get the duration of tracks then immediatly remove it after setting each tracks duration.
  useEffect(() => {
    const mouse = async () => {
      await Tone.start();
      setDuration(player.duration());
    };

    if (!duration) {
      document.documentElement.addEventListener('mousedown', mouse);
    }
    return () => {
      document.documentElement.removeEventListener('mousedown', mouse);
    };
  }, [duration]);

  useEffect(() => {
    setDuration(player.duration());
    console.log('RERENDER');
  }, [playerPlaybackRate, trimFromEnd]);
  const changeVolumeValue = (event, newValue) => {
    newValue = Math.round(newValue);
    setVolumeSliderValue(newValue);
    player.changeVolumeValue(-40 + newValue);
  };

  const muteLayer = () => {
    player.toggleMute();
    setIsMuted(player._mute);
  };

  const soloLayer = () => {
    player.toggleSolo();
    setIsSolo(player._solo);
  };
  const trimFromStartTime = (event, newValue) => {
    player.changeTrimFromStart(newValue);
    setTrimFromStart((prevTrimFromStart) => newValue);
  };
  const trimFromEndTime = (event, newValue) => {
    console.log('newValue', newValue);
    player.changeTrimFromEnd(newValue);
    setTrimFromEnd((prevTrimFromEnd) => newValue);
  };

  const changePlaybackRate = (event, newValue) => {
    setPlayerPlaybackRate(newValue);
    player.changePlaybackRate(newValue);
  };

  const changeDetune = (event, newValue) => {
    newValue = Number(newValue);

    player.changeDetuneValue(newValue * 100);
    setPlayerDetune(newValue);
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
          label={player.name}
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
          className={'visual-layer' + id}
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
            Edit Layer: {player.name}
          </Typography>
          <Typography>Track Duration {player.duration().toFixed(2)}</Typography>
          <Typography>
            Volume:{' '}
            {volumeSliderValue === 40
              ? 'Max'
              : volumeSliderValue === 0
              ? 'Min'
              : volumeSliderValue}
          </Typography>
          <Slider
            min={0}
            max={40}
            value={volumeSliderValue}
            onChange={changeVolumeValue}
            aria-label='Volume Slider'
            // valueLabelDisplay='auto'
          />
          <Typography> Pitch {playerDetune} </Typography>
          <Slider
            min={-12}
            max={12}
            value={playerDetune}
            onChange={changeDetune}
            aria-label='Trim Slider'
            // valueLabelDisplay='auto'
          />

          <Typography>
            Trim From Start
            {Number((trimFromStart / playerPlaybackRate).toFixed(2))}
          </Typography>
          <Slider
            min={0}
            max={Number(player.duration())}
            value={trimFromStart}
            onChange={trimFromStartTime}
            aria-label='Trim Slider'
            // valueLabelDisplay='auto'
            step={0.1}
          />
          <Typography>
            Trim From End
            {-Number(Math.abs(trimFromEnd) / playerPlaybackRate).toFixed(2)}
          </Typography>
          <Slider
            min={-Number(duration)}
            max={Number(duration) - Number(duration)}
            value={trimFromEnd}
            onChange={trimFromEndTime}
            aria-label='Trim Slider'
            // valueLabelDisplay='auto'
            track='inverted'
            step={0.1}
          />
          <Typography>
            {' '}
            Track Will Start at{' '}
            {(trimFromStart / playerPlaybackRate).toFixed(2)}
            {' '}
            <br></br>
            Track Will End at {' '}

            {(
              duration -
              Math.abs(trimFromEnd) / playerPlaybackRate
            ).toFixed(2)}
          </Typography>
          <Typography> Set Track Playback {playerPlaybackRate} </Typography>
          <Slider
            min={0.5}
            max={2}
            step={0.01}
            value={playerPlaybackRate}
            onChange={changePlaybackRate}
            aria-label='Trim Slider'
            valueLabelDisplay='auto'
          />
        </Box>
      </Modal>
    </>
  );
}
