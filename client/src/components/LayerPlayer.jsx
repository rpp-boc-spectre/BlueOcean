import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';

import { useSnackbar } from 'material-ui-snackbar-provider';
import { useLayerStore } from '../context/LayerContext.js'

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { addLayer, removeLayer } from '../lib/layerTableReducer.js';
import { saveTrackData } from '../utils/database.js';
import { Layer } from '../lib/layer.js'
import { player } from '../lib/player.js'

import LayerEditor from './LayerEditor.jsx';
import TimeControlBox from './editorComponents/TimeControlBox.jsx';
import SettingsList from './editorComponents/SettingsList.jsx';


export default function LayerPlayer({ layers, trackId, trackMetadata, userId, recordingHandler, importHandler, uploadHandler, updateMetadata }) {
  const [layerStore, dispatch] = useLayerStore()
  const allLayersPlayState = useRef('');
  const allLayersRef = useRef(layerStore.allLayers)
  const snackbar = useSnackbar()
  const [player, setPlayer] = useState(null)
  const playerRef = useRef(player)

  const playAllLayers = async () => {
    if (player) {
      player.start()
    }
  };

  const stopAllLayers = () => {
    if (player) {
      player.stop()
    }
  };

  const pauseResumeAllLayers = () => {
    player.pause()
  };

  const handleSaveClick = async () => {
    try {
      await saveTrackData(player.layers, userId, trackId, trackMetadata);
      snackbar.showMessage(<Alert variant='success'>Track saved</Alert>)
    } catch (error) {
      console.log(error)
      snackbar.showMessage(<Alert variant='error'>Track failed to save</Alert>)
    }
  }

  // create refs to be used during cleanup
  useEffect(() => {
    player.current = player
  }, [player]);

  // create audio layers
  useEffect(() => {
    layers.forEach((layer, index) => {
      const newPlayer = new Layer({ ...layer, id: index, layerData: layer })
      newPlayer.connect()
      dispatch(addLayer(newPlayer))
    });
  }, [layers]);

  //cleanup on unmount
  useEffect(() => {
    return () => {
      for (let key of Object.keys(allLayersRef.current)) {
        let player = allLayersRef.current[key].player
        player.dispose()
        Tone.Transport.cancel(0)
        dispatch(removeLayer(key))
      }
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
        {player?.layers.map((layer, index) => <LayerEditor key={index} id={index} />)}
      </Box>
    </>
  );
}