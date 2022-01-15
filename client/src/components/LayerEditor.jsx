import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Box';
import { useLayerStore } from '../context/LayerContext.js';
import Container from '@mui/material/Container';
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

    setTrimFromStart((prevTrimFromStart) => newValue);
    player.changeTrimFromStart(newValue);
  };
  const trimFromEndTime = (event, newValue) => {

    setTrimFromEnd((prevTrimFromEnd) => newValue);
    player.changeTrimFromEnd(newValue);
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
    <Container sx={{
      bgcolor: 'background.paper',
      border: 1,
      mt: 1,
      pt: 1,
      pb: 1,
      // width: {xs: '65%', sm: '70%', md: '60%'}
    }}>
      <Box sx={{
        minHeight: { xs: '22vh', sm: '22vh', md: '16vh' },
        maxHeight: { xs: '13vh', md: '16vh' },
        border: '2px, solid, black',
        display: 'grid',
        gridTemplateColumns: {xs: '1fr', md: '2fr 3fr'},
        gridTemplateRows: {xs: '1fr, 3fr, 3fr', md: '1fr 3fr'}
      }}>
        <Typography
          variant='h1'
          sx={{
            gridRow: {xs: '1', md: '1'},
            gridColumn: {xs: '1', md: '1 / 2'},
            fontFamily: 'Roboto',
            pb: 1
          }}
        >
          {player.name}
        </Typography>
        <Box sx={{
          gridRow: {xs: '2', md: '2'},
          gridColumn: {xs: '1', md: '1'},
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
        <Box sx={{
          gridRow: {xs: '3', md: '2'},
          gridColumn: {xs: '1', md: '2'},
          maxWidth: '40vh',
          m: 'auto'
        }}>
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
          <Typography
            variant='subtitle2'
            id='modal-edit-title'
            sx={{
              fontFamily: 'Roboto',
              pb: 1
            }}
          >
            Edit Layer: {player.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              pb: 1
            }}
          >
            Track Duration { player.duration().toFixed(2)}
          </Typography>
          <Typography
           sx={{
            fontFamily: 'Roboto',
            pb: 1
          }}
          >
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
          <Typography sx={{
              fontFamily: 'Roboto',
              pb: 1
            }}> Pitch: {playerDetune} </Typography>
          <Slider
            min={-12}
            max={12}
            value={playerDetune}
            onChange={changeDetune}
            aria-label='Trim Slider'
            // valueLabelDisplay='auto'
          />

          <Typography
            sx={{
              fontFamily: 'Roboto',
              pb: 1
            }}
          >
            Trim From Start:
            {(trimFromStart / playerPlaybackRate).toFixed(2)}
          </Typography>
          <Slider
            min={0}
            max={Number(player.duration())}
            value={trimFromStart}
            onChange={trimFromStartTime}
            aria-label='Trim Slider'
            // valueLabelDisplay='auto'
            step={0.01}
          />
          <Typography
            sx={{
              fontFamily: 'Roboto',
              pb: 1
            }}
          >
            Trim From End:
            {Math.abs((trimFromEnd) / playerPlaybackRate).toFixed(2)}
            {/* {-Number( player.duration() - Math.abs(trimFromEnd) / playerPlaybackRate).toFixed(2)} */}
          </Typography>
          <Slider
            min={-Number(player.duration())}
            max={0}
            value={trimFromEnd}
            onChange={trimFromEndTime}
            aria-label='Trim Slider'
            // valueLabelDisplay='auto'
            track='inverted'
            step={0.01}
          />
          <Typography
            sx={{
              fontFamily: 'Roboto',
              pb: 1
            }}
          >
            {' '}
            Track Will Start at {' '}
            {(trimFromStart / playerPlaybackRate).toFixed(2)}

            {' '}
            {/* <br></br> */}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Roboto',
                pb: 1
              }}
            >
              Track Will End at {' '}
              { (player.duration() + trimFromEnd).toFixed(2)}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              pb: 1
            }}
          >
            Set Track Playback {playerPlaybackRate}
          </Typography>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={playerPlaybackRate}
            onChange={changePlaybackRate}
            aria-label='Trim Slider'
            valueLabelDisplay='auto'
          />
        </Box>
      </Modal>
    </Container>
  );
}
