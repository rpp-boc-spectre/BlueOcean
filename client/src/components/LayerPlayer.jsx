import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Tone from 'tone';

import toast from 'react-hot-toast';
import { useLayerStore } from '../context/LayerContext.js';

import { Alert, Box, Modal, Typography, Slider, Container, Divider, Stack } from '@mui/material';
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
  const playerRef = useRef(layerStore.player);
  const [allLayersLoaded, setAllLayersLoaded] = useState(false);
  const [globalPitch, setGlobalPitch] = useState(0);
  const [globalVolume, setGlobalVolume] = useState(20)
  const [globalPlayback, setGlobalPlayback] = useState(1)
  const [trackName, setTrackName] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)

  const playAllLayers = async () => {
    if (layerStore.player) {
      console.log('LAYERPLAYER', layerStore.player);
      layerStore.player.start();
      setTrackName(layerStore.player.meta.trackName);
      setCurrentlyPlaying(true);
    }
  };

  const stopAllLayers = () => {
    if (layerStore.player) {
      layerStore.player.stop();
      setCurrentlyPlaying(false);
    }
  };

  const pauseResumeAllLayers = () => {
    if (layerStore.player) {
      layerStore.player.pause();
      setCurrentlyPlaying(false);
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
        toast.custom(<Alert variant='filled' severity='error'>Please enter a track name</Alert>)
      } else {
        let id = await saveTrackData(layerStore.player, userId, temp);
        toast.custom(<Alert variant='filled' severity='success' color='primary'>Track saved</Alert>)
        if (!trackId) {
          navigate(`/edit/${id}`)
        }
      }
    } catch (error) {
      toast.custom(<Alert variant='filled' severity='error'>Track failed to save</Alert>)
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
        bgcolor: 'secondary.light',
        border: 1,
        gridRow: {xs: '1', md: '1'},
        borderRadius: {xs: '0', md: '5% 5% 0% 0%'},
        width: {xs: '70%', sm: '85%', md: '95%'},
      }}>
        {(allLayersLoaded && layers) &&
          layers.map((layer, index) => <LayerEditor key={index} id={index} player={layerStore.player.layers[index]} />)}
      </Container>
      {/* <Divider /> */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          bgcolor: 'buttons.submitHover',
          border: 1,
          // display: 'grid',
          // gridTemplateColumns: {xs: '2fr 2fr', md: '2fr 1fr 2fr'},
          // gridRow: {xs: '2', md: '2'},
          borderRadius: {xs: '0', md: '0% 0% 5% 5%'},
          width: {xs: '70%', sm: '85%', md: '95%'},
          mx: "auto",
          gap: 1
        }}>
          {/* <Container
          sx={{
            bgcolor: 'buttons.submitHover',
            border: 1,
            // display: 'grid',
            // gridTemplateColumns: {xs: '2fr 2fr', md: '2fr 1fr 2fr'},
            // gridRow: {xs: '2', md: '2'},
            borderRadius: {xs: '0', md: '0% 0% 5% 5%'},
            width: {xs: '70%', sm: '85%', md: '95%'},
            mx:
          }}>
          > */}

        <Container
          sx={{
            gridColumn: {xs: '1', md: '1'},
            display: 'flex',
            m: 'auto'
          }}
        >

          <TimeControlBox
            isPlaying={currentlyPlaying}
            playAllHandler={playAllLayers}
            stopAllHandler={stopAllLayers}
            pauseResumeHandler={pauseResumeAllLayers}
            editorOpenHandler={layerEditorOpen}
          />
        </Container>
        <Container
          sx={{
            gridColumn: {xs: '2', md: '3'},
            display: 'flex',
            m: 'auto'
          }}
        >
          <FileControlBox
            isPlaying={currentlyPlaying}
            recordingHandler={recordingHandler}
            importHandler={importHandler}
            uploadHandler={uploadHandler}
            saveHandler={handleSaveClick}
            metadata={trackMetadata}
            updateMetadata={updateMetadata}
          />
        </Container>
        {/* </Container> */}
        </Stack>

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
            width: { xs: '75%', sm: '75%', md: 400 },
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
           variant='subtitle2'
           id='modal-edit-title'
           sx={{
            fontFamily: 'Roboto',
            pb: 1
           }}
          >
            <b>Edit Track </b>{trackName ? trackName : ''}
          </Typography>
          {/* <Typography variant='subtitle2' id='modal-edit-title'>
            Edit for all layers
          </Typography> */}
          <Typography
            sx={{
              fontFamily: 'Roboto',
              pb: 1
            }}
          >
            <b>Volume</b>: {globalVolume === 40 ? "Max" : globalVolume === 0 ? 'Min' : globalVolume}
          </Typography>
          <Slider
            min={0}
            max={40}
            value={globalVolume}
            onChange={changeVolumeValue}
            aria-label='Volume Slider'
            valueLabelDisplay='auto'
          />
          <Typography
            sx={{
              fontFamily: 'Roboto',
              pb: 1
            }}
          >
            <b>Set Track Pitch</b>: {globalPitch}
          </Typography>
          <Slider
            min={-12}
            max={12}
            value={globalPitch}
            onChange={changeDetune}
            aria-label='Trim Slider'
            valueLabelDisplay='auto'
          />
          <Typography
            sx={{
              fontFamily: 'Roboto',
              pb: 1
            }}
          >
            <b>Set Track Playback</b>: {globalPlayback}
          </Typography>
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
    </>
  );
}
