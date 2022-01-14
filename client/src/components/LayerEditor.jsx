import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
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
    setTrimFromStart(newValue);
    player.changeTrimFromStart(newValue);
  };
  const trimFromEndTime = (event, newValue) => {
    player.changeTrimFromEnd(newValue);
    setTrimFromEnd((prevTrimFromEnd)=>newValue);

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
    setDuration(Number((player.duration() / player.playbackRate).toFixed(2)));
    newPlayback = Number.parseFloat(newPlayback - 0.1).toFixed(2);
    newPlayback = Number(newPlayback);

    player.decreasePlaybackRate(newPlayback);
    setPlayerPlaybackRate(newPlayback);
  };

  const increaseGrain = (event) => {
    let newGrain = Number(event.target.value);

    newGrain = Number.parseFloat(newGrain + 0.01).toFixed(2);
    newGrain = Number(newGrain);

    player.player.grainSize = newGrain;
    setPlayerGrain(newGrain);
  };

  const decreaseGrain = (event) => {
    let newGrain = Number(event.target.value);
    newGrain = Number.parseFloat(newGrain - 0.01).toFixed(2);
    newGrain = Number(newGrain);
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
    <Container sx={{
      bgcolor: 'background.paper',
      padding: '0px',
      border: 1,
      mt: 1
    }}>
      <Box sx={{
        minHeight: { xs: '13vh', md: '16vh' },
        maxHeight: { xs: '13vh', md: '16vh' },
        border: '2px, solid, black',
        display: 'grid',
        gridTemplateColumns: '2fr 3fr',
        gridTemplateRows: '1fr 3fr'
      }}>
        <FormControlLabel
          sx={{ gridRow: '1', gridColumn: '1 / 2' }}
          label={player.name}
          control={<Checkbox defaultChecked />}
        />
        <Box sx={{
          gridRow: '2',
          gridColumn: '1',
          maxWidth: '25vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 1
        }}>
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
        <Box sx={{ gridRow: '2', gridColumn: '2', maxWidth: '40vh', m: 'auto' }}>
          <canvas
            className={'visual-layer' + id}
            width='350'
            height='75'></canvas>
        </Box>
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
          <Typography>
            Track Duration {Number(player.duration().toFixed(2))}
          </Typography>
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
            max={Number(player.duration().toFixed(2))}
            value={trimFromStart}
            onChange={trimFromStartTime}
            aria-label='Trim Slider'
            valueLabelDisplay='auto'
            step={0.1}
          />
          <Typography>Trim From End</Typography>
          <Slider
            min={0}
            max={Number(player.duration().toFixed(2))}
            value={trimFromEnd}
            onChange={trimFromEndTime}
            aria-label='Trim Slider'
            valueLabelDisplay='auto'
            track='inverted'
            step={0.1}
          />
          <Typography>Playback Rate {playerPlaybackRate}</Typography>

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
    </Container>
  );
}
