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


export default function LayerEditorCopy({ layerPlayer, pitchShift, layerVolume, pitch, volume, layerData }) {


  const [isMuted, setIsMuted] = useState(layerPlayer.mute);
  const [duration, setDuration] = useState(false);
  const [pitchSliderValue, setPitchSliderValue] = useState(pitch);
  const [volumeSliderValue, setVolumeSliderValue] = useState(volume);

  // put page on mousedown listener to get the duration of tracks then immediatly remove it after setting each tracks duration.
  useEffect(() => {
    const mouse = async () => {
      await Tone.start();
      setDuration(layerPlayer._buffer.duration);
    };

    if (!duration) {
      document.documentElement.addEventListener('mousedown', mouse);
    }
    return () => {
      document.documentElement.removeEventListener('mousedown', mouse);
    };
  }, [duration]);

  const playLayer = async () => {
    try {
      await Tone.start();
      await Tone.loaded();
      // stop layerPlayer if you dont want multiple instances playing
      layerPlayer.sync().stop();
      layerPlayer.sync().start();
      Tone.Transport.start();
    } catch (error) {
      console.log('Error Playing Layer', error);
    }
  };

  const stopLayer = async () => {
    //may or may not be useful , gets the current players position on

    await layerPlayer.unsync().stop();
    //  NOTE: Do not call Tone.Transport.stop() or ALL audio will stop
  };

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
    layerPlayer.mute = !isMuted;
  };

  // editor modal handlers
  const [editOpen, setEditOpen] = React.useState(false);
  const layerEditorOpen = () => {
    setEditOpen(true);
  };
  const layerEditClose = () => {
    setEditOpen(false);
  }

  return (
    <>
      <Box
        sx={{
          minHeight: { xs: '13vh', md: '16vh' },
          maxHeight: { xs: '13vh', md: '16vh' },
          border: '1px, solid, black',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 4fr',
        }}
      >
        <FormControlLabel
          sx={{ gridRow: '1', gridColumn: '1' }}
          label={layerData.layerName}
          control={<Checkbox defaultChecked />}
        />
        <Box sx={{ gridRow: '1', gridColumn: '2', maxWidth: '25vh' }}>
          <TimeControlButton button={{ name: 'Play', handler: playLayer }} />
          <TimeControlButton button={{ name: 'Stop', handler: stopLayer }} />
          <TimeControlButton button={{ name: 'Mute', handler: muteLayer, value: isMuted }} />
          <TimeControlButton button={{ name: 'Edit', handler: layerEditorOpen }} />
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
            width: { xs: '95%', md: 400 },
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='subtitle2' id='modal-edit-title'>Edit Layer: {layerData.layerName}</Typography>
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

    // const changePitchValue = (e) => {
    //   var rangeInputValue = e.target.value;
    //   var output = document.getElementById(props.id);
    //   output.innerHTML = rangeInputValue;
    //   setPitchSliderValue(rangeInputValue);
    //   // set the pitch to be the number we get from the range input
    //   pitchShift.pitch = rangeInputValue;
    // };
    // const changeVolumeValue = (e) => {
    //   var volumeSliderInputValue = e.target.value;
    //   var output = document.getElementById('volume' + props.id);
    //   output.innerHTML = volumeSliderInputValue;
    //   setVolumeSliderValue(volumeSliderInputValue);
    //   // set the volume to be the number we get from the range input
    //   layerVolume.volume.value = volumeSliderInputValue;
    // };

    // <div className='layerEditor' id={props.id + 'layer'}>
    //   <h3>Layer Editor Component</h3>
    //   <button onClick={playLayer} disabled={isMuted === true}>
    //     Play Layer {props.layerData.layerName}
    //   </button>
    //   <button onClick={stopLayer}>Stop Layer {props.id}</button>
    //   <button onClick={muteLayer} value='' id={'mute' + props.id}>
    //     Mute Layer {props.layerData.layerName}
    //   </button>

    //   <div className='slidecontainer'>
    //     <input
    //       type='range'
    //       min='0'
    //       max='12'
    //       value={pitchSliderValue}
    //       onInput={changePitchValue}
    //       className='slider'
    //       id='myRange'
    //     />
    //     <p>
    //       Pitch:{' '}
    //       <span id={props.id} value={pitchSliderValue}>
    //         {pitchSliderValue}
    //       </span>
    //     </p>
    //   </div>
    //   <div className='volumeSlideContainer'>
    //     <input
    //       type='range'
    //       min='-20'
    //       max='20'
    //       value={volumeSliderValue}
    //       onInput={changeVolumeValue}
    //       className='slider'
    //       id='myRange'
    //     />
    //     <p>
    //       Volume:{' '}
    //       <span id={'volume' + props.id} value={volumeSliderValue}>
    //         {volumeSliderValue}
    //       </span>
    //     </p>
    //   </div>
    // </div>
  );
}
