import React, { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

import { useSnackbar } from 'material-ui-snackbar-provider';
import { useLayerStore } from '../context/LayerContext.js'

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { addLayer, removeLayer, setPlayer } from '../lib/layerTableReducer.js';
import { saveTrackData } from '../utils/database.js';
import { Player } from '../lib/player.js'

import LayerEditor from './LayerEditor.jsx';
import TimeControlBox from './editorComponents/TimeControlBox.jsx';
import SettingsList from './editorComponents/SettingsList.jsx';


export default function LayerPlayer({ layers, trackId, trackMetadata, userId, recordingHandler, importHandler, uploadHandler, updateMetadata, trackData }) {
  const [layerStore, dispatch] = useLayerStore()
  const allLayersPlayState = useRef('');
  const allLayersRef = useRef(layerStore.allLayers)
  const snackbar = useSnackbar()
  const playerRef = useRef(layerStore.player)
  const [allLayersLoaded, setAllLayersLoaded] = useState(false)

  const playAllLayers = async () => {
    if (layerStore.player) {
      layerStore.player.start()
    }
  };

  const stopAllLayers = () => {
    if (layerStore.player) {
      layerStore.player.stop()
    }
  };

  const pauseResumeAllLayers = () => {
    if (layerStore.player) {
      layerStore.player.pause()
    }
  };

  const handleSaveClick = async () => {
    try {
      await saveTrackData(layerStore.player, userId, trackMetadata);
      snackbar.showMessage(<Alert variant='success'>Track saved</Alert>)
    } catch (error) {
      console.log(error)
      snackbar.showMessage(<Alert variant='error'>Track failed to save</Alert>)
    }
  }

  // create refs to be used during cleanup
  useEffect(() => {
    playerRef.current = layerStore.player
  }, [layerStore.player]);

  // create audio layers
  useEffect(() => {
    if (layers?.length > 0 && layerStore.player) {
      setAllLayersLoaded(false)
      layerStore.player.reload(layers)
      setAllLayersLoaded(true)
    }

    if (layers?.length > 0 && !layerStore.player) {
      let newPlayer = new Player(layers, trackData)
      dispatch(setPlayer(newPlayer))
      setAllLayersLoaded(true)
    }
  }, [layers]);

  //cleanup on unmount
  useEffect(() => {
    return () => {
      layerStore.player.dispose()
    }
  }, [])

  return (
    <>
      <SettingsList importHandler={importHandler} saveHandler={handleSaveClick} uploadHandler={uploadHandler} metadata={trackMetadata} updateMetadata={updateMetadata} />
      <TimeControlBox recordingHandler={recordingHandler} playAllHandler={playAllLayers} stopAllHandler={stopAllLayers} pauseResumeHandler={pauseResumeAllLayers} />
      <Box
        sx={{
          bgcolor: 'background.paper',
          gridColumn: { xs: '1 / 3', md: '2' },
          gridRow: { xs: '1', md: '1 / 3' },
          minHeight: '60vh',
          maxHeight: '80vh',
          padding: { xs: '0', md: '10px' },
        }}
      >
        {allLayersLoaded && layers.map((layer, index) => <LayerEditor key={index} id={index} />)}
      </Box>
    </>
  );
}