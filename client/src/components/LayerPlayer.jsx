import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Tone from 'tone';

import { useSnackbar } from 'material-ui-snackbar-provider';
import { useLayerStore } from '../context/LayerContext.js';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { addLayer, removeLayer, setPlayer } from '../lib/layerTableReducer.js';
import { saveTrackData } from '../utils/database.js';
import { Player } from '../lib/player.js';

import LayerEditor from './LayerEditor.jsx';
import TimeControlBox from './editorComponents/TimeControlBox.jsx';
import TimeControlButton from './editorComponents/TimeControlButton.jsx';
import FileControlBox from './editorComponents/FileControlBox.jsx';
import FileControlButton from './editorComponents/FileControlButton.jsx';

export default function LayerPlayer({
  layers,
  trackId,
  trackMetadata,
  userId,
  recordingHandler,
  importHandler,
  uploadHandler,
  updateMetadata,
  trackData,
}) {
  const [layerStore, dispatch] = useLayerStore();
  const navigate = useNavigate();
  // const allLayersPlayState = useRef('');
  // const allLayersRef = useRef(layerStore.allLayers);
  const snackbar = useSnackbar();
  const playerRef = useRef(layerStore.player);
  const [allLayersLoaded, setAllLayersLoaded] = useState(false);
  const [globalPitch, setGlobalPitch] = useState(0);
  const [globalVolume, setGlobalVolume] = useState(20)
  const [globalPlayback, setGlobalPlayback] = useState(1)

  const playAllLayers = async () => {
    if (layerStore.player) {
      console.log('LAYERPLAYER', layerStore.player);
      layerStore.player.start();
    }
  };

  const stopAllLayers = () => {
    if (layerStore.player) {
      layerStore.player.stop();
    }
  };

  const pauseResumeAllLayers = () => {
    if (layerStore.player) {
      layerStore.player.pause();
    }
  };

  const handleSaveClick = async () => {
    try {
      let temp = { ...trackMetadata };
      if (temp.tag === undefined) {
        temp.tag = "General";
      }
      if (temp.public === undefined) {
        temp.public = false;
      }
      if (temp.trackName === undefined || temp.trackName === "") {
        snackbar.showMessage(<Alert variant='error'>Please enter a track name</Alert>);
      } else {
        let id = await saveTrackData(layerStore.player, userId, temp);
        snackbar.showMessage(<Alert variant='success'>Track saved</Alert>);
        if (!trackId) {
          navigate(`/edit/${id}`)
        }
      }
    } catch (error) {
      console.log(error);
      snackbar.showMessage(<Alert variant='error'>Track failed to save</Alert>);
    }
  };

  // create refs to be used during cleanup
  useEffect(() => {
    playerRef.current = layerStore.player;
  }, [layerStore.player]);

  // create audio layers
  useEffect(() => {
    console.log('layers changed', layers)
    if (layers?.length > 0 && layerStore.player) {
      console.log('Reloading')
      setAllLayersLoaded(false);
      layerStore.player.reload(layers);
      setAllLayersLoaded(true);
    }

    if (layers?.length > 0 && !layerStore.player) {
      let newPlayer = new Player(layers, trackData);
      dispatch(setPlayer(newPlayer));
      setAllLayersLoaded(true);
    }
  }, [layers]);

  //cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current !== null) {
        playerRef.current.dispose();
        dispatch(setPlayer(null))
      }
    };
  }, []);

  const changeDetune = (event, newValue) => {
    newValue = Number(newValue);
    // newValue * 100
    layerStore.player.setAllLayersPitch(newValue * 100);
    setGlobalPitch(newValue);
  };


  const changeVolumeValue = (event, newValue) => {
    newValue = Math.round(newValue);
    setGlobalVolume(newValue);
    layerStore.player.setAllLayersVolume(-40 + newValue)
  };

  const changePlaybackRate = (event, newValue) => {

    console.log('nev', newValue)
    let newPlayback = Number(event.target.value);
    console.log('Newpl', newPlayback)
    newPlayback >= 0.5 ? newPlayback = Number.parseFloat(newPlayback).toFixed(2) :
      newPlayback = Number.parseFloat(newPlayback + 0.1).toFixed(2);

    newPlayback = Number(newPlayback);
    setGlobalPlayback(newPlayback)
    layerStore.player.setAllLayersPlaybackRate(newPlayback)

  }
  const [editOpen, setEditOpen] = React.useState(false);
  const layerEditorOpen = () => {
    setEditOpen(true);
  };
  const layerEditClose = () => {
    setEditOpen(false);
  };
  return (
    <>
      <Container sx={{
        border: 1,
        gridRow: {md: '1'}
      }}>
        {(allLayersLoaded && layers) &&
          layers.map((layer, index) => <LayerEditor key={index} id={index} player={layerStore.player.layers[index]} />)}
      </Container>
      <Divider />
      <Container sx={{
        border: 1,
        display: 'grid',
        gridRow: {md: '2'}
      }}>
        <Container
          sx={{
            gridColumn: {md: '1'},
            gridRow: {md: '2'}
          }}
        >
          <TimeControlBox
            playAllHandler={playAllLayers}
            stopAllHandler={stopAllLayers}
            pauseResumeHandler={pauseResumeAllLayers}
            editorOpenHandler={layerEditorOpen}
          />
        </Container>
        <Container
          sx={{
            gridColumn: {md: '3'},
            gridRow: {md: '2'}
          }}
        >
          <FileControlBox
            recordingHandler={recordingHandler}
            importHandler={importHandler}
            uploadHandler={uploadHandler}
            saveHandler={handleSaveClick}
            metadata={trackMetadata}
            updateMetadata={updateMetadata}
          />
        </Container>
        <Box
          sx={{
            bgcolor: 'background.paper',
            // gridColumn: { xs: '1 / 3', md: '2' },
            // gridRow: { xs: '1', md: '1 / 3' },
            // minHeight: '60vh',
            maxHeight: '80vh',
            padding: { xs: '0', md: '10px' },
          }}
          >
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
                Edit Layer: {'placeholder'}
              </Typography>
              <Typography>Volume: {globalVolume === 40 ? "Max" : globalVolume === 0 ? 'Min' : globalVolume}</Typography>
              <Slider
                min={0}
                max={40}
                value={globalVolume}
                onChange={changeVolumeValue}
                aria-label='Volume Slider'
                valueLabelDisplay='auto'
              />
              <Typography> Set Track Pitch {globalPitch} </Typography>
              <Slider
                min={-12}
                max={12}
                value={globalPitch}
                onChange={changeDetune}
                aria-label='Trim Slider'
                valueLabelDisplay='auto'
              />
              <Typography> Set Track Playback {globalPlayback} </Typography>
              <Slider
                min={.50}
                max={2}
                step={.10}
                value={globalPlayback}
                onChange={changePlaybackRate}
                aria-label='Trim Slider'
                valueLabelDisplay='auto'
              />
            </Box>
          </Modal>
        </Box>
      </Container>
    </>
  );
}
