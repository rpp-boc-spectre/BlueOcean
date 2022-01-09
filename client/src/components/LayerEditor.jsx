import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

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
  const [volumeSliderValue, setVolumeSliderValue] = useState(Math.round(player._volume));
  const [trimFromStart, setTrimFromStart] = useState(player.trimFromStart);
  const [trimFromEnd, setTrimFromEnd] = useState(player.trimFromEnd);
  const [playerPlaybackRate, setPlayerPlaybackRate] = useState(
    player.playbackRate
  );

  const [playerGrain, setPlayerGrain] = useState(player.player.grainSize);
  const [playerOverlap, setPlayerOverlap] = useState(player.player.overlap);
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

  const changeVolumeValue = (event, newValue) => {
    newValue = Math.round(newValue);
    setVolumeSliderValue(newValue);
    player.changeVolumeValue(newValue);
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
    newValue = Number.parseFloat(newValue).toFixed(2);
    newValue = Number(newValue);
    setTrimFromStart(newValue);
    player.changeTrimFromStart(newValue);
  };
  const trimFromEndTime = (event, newValue) => {
    newValue = Number.parseFloat(newValue).toFixed(2);
    newValue = Number(newValue);
    setTrimFromEnd(newValue);
    player.changeTrimFromEnd(newValue);
  };
  const increasePlayback = (event, newValue) => {
    event.preventDefault();
    let newPlayback = Number(event.target.value);
    newPlayback = Number.parseFloat(newPlayback + 0.1).toFixed(2);
    newPlayback = Number(newPlayback);
    player.increasePlaybackRate(newPlayback);
    setPlayerPlaybackRate(newPlayback);
  };
  const decreasePlayback = (event) => {
    event.preventDefault();
    let newPlayback = Number(event.target.value);

    newPlayback = Number.parseFloat(newPlayback - 0.1).toFixed(2);
    newPlayback = Number(newPlayback);
    console.log('type', typeof newPlayback, Number(newPlayback));
    player.decreasePlaybackRate(newPlayback);
    setPlayerPlaybackRate(newPlayback);
  };

  const increaseGrain = (event) => {
    let newGrain = Number(event.target.value);

    newGrain = Number.parseFloat(newGrain + 0.01).toFixed(2);
    newGrain = Number(newGrain);

    console.log('NEWGRAIN', newGrain);
    player.player.grainSize = newGrain;
    setPlayerGrain(newGrain);
  };

  const decreaseGrain = (event) => {
    let newGrain = Number(event.target.value);

    newGrain = Number.parseFloat(newGrain - 0.01).toFixed(2);
    newGrain = Number(newGrain);

    console.log('NEWGRAIN', newGrain);
    player.player.grainSize = newGrain;
    setPlayerGrain(newGrain);
  };

  const increaseOverlap = (event) => {
    let newOverlap = Number(event.target.value);
    newOverlap = Number.parseFloat(newOverlap + 0.01).toFixed(2);

    newOverlap = Number(newOverlap);

    player.player.overlap = newOverlap;

    setPlayerOverlap(newOverlap);
  };

  const decreaseOverlap = (event) => {
    let newOverlap = Number(event.target.value);
    newOverlap = Number.parseFloat(newOverlap - 0.01).toFixed(2);

    newOverlap = Number(newOverlap);

    player.player.overlap = newOverlap;

    setPlayerOverlap(newOverlap);
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
          <Typography>Volume</Typography>
          <Slider
            min={-40}
            max={5}
            value={volumeSliderValue}
            onChange={changeVolumeValue}
            aria-label='Volume Slider'
            valueLabelDisplay='auto'
          />
          <Typography> Pitch {playerDetune} </Typography>
          <Slider
            min={-12}
            max={12}
            value={playerDetune}
            onChange={changeDetune}
            aria-label='Trim Slider'
            valueLabelDisplay='auto'
          />

          <Typography>Trim From Start</Typography>
          <Slider
            min={0}
            max={player.duration() / player.playbackRate}
            value={trimFromStart}
            onChange={trimFromStartTime}
            aria-label='Trim Slider'
            valueLabelDisplay='auto'
          />
          <Typography>Trim From End</Typography>
          <Slider
            min={0}
            max={player.duration() / player.playbackRate}
            value={trimFromEnd}
            onChange={trimFromEndTime}
            aria-label='Trim Slider'
            valueLabelDisplay='auto'
            track='inverted'
          />
          <Typography>
            Playback Rate {Number(playerPlaybackRate).toFixed(2)}
          </Typography>
          <Button
            name='decreasePlayback'
            onClick={decreasePlayback}
            value={playerPlaybackRate}>
            -
          </Button>
          <Button
            name='increasePlayback'
            onClick={increasePlayback}
            value={playerPlaybackRate}>
            +
          </Button>

          <Typography>Grain Size {playerGrain}</Typography>

          <Button name='testGrain' onClick={decreaseGrain} value={playerGrain}>
            -GrainSize
          </Button>

          <Button name='testGrain' onClick={increaseGrain} value={playerGrain}>
            +GrainSize
          </Button>

          <Typography>Overlap/Crossfade {playerOverlap}</Typography>
          <Button
            name='decreaseOverlap'
            onClick={decreaseOverlap}
            value={playerOverlap}>
            -Overlap Size
          </Button>
          <Button
            name='increaseOverlap'
            onClick={increaseOverlap}
            value={playerOverlap}>
            +Overlap Size
          </Button>
        </Box>
      </Modal>
    </>
  );
}
