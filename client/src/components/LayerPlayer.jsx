import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';

import { useSnackbar } from 'material-ui-snackbar-provider';
import { useLayerStore } from '../context/LayerContext.js'

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { addLayer, removeLayer } from '../lib/layerTableReducer.js';
import { saveTrackData } from '../utils/database.js';
import { Layer } from '../lib/layer.js'

import LayerEditor from './LayerEditor.jsx';
import TimeControlBox from './editorComponents/TimeControlBox.jsx';
import SettingsList from './editorComponents/SettingsList.jsx';


export default function LayerPlayer({ layers, trackId, trackMetadata, userId, recordingHandler, importHandler, uploadHandler }) {
  const [layerStore, dispatch] = useLayerStore()

  const allLayersPlayState = useRef('');
  const allLayersRef = useRef(layerStore.allLayers)
  const snackbar = useSnackbar()

  const playAllLayers = async () => {
    try {
      await Tone.start();
      await Tone.loaded();

      let keys = Object.keys(layerStore.allLayers)
      keys.forEach((layerKey, i) => {
        let layer = layerStore.allLayers[layerKey]
        Tone.Transport.schedule((time) => {
          Tone.Draw.schedule(() => {
            renderWaveform(layer.waveform, layerKey);
          }, time);
        }, "+0.005");

        console.log('LAYER', layer.trimFromStart)
        layer.start((layer.trimFromStart), layer.trimFromStart, layer.trimFromEnd)
        // layer.player.sync().start()
      });


      allLayersPlayState.current = 'started';
      // move tranport down here  and set the play head back to 0.
      // this prevents us from having timing errors + fixes bug where
      // if you pressed play again after the track was over it would throw an error,
      // because it can't actually play from the time you want it to as its passed.
      Tone.Transport.seconds = 0
      Tone.Transport.start();
    } catch (error) {
      console.log('ERROR', error)
      snackbar.showMessage(<Alert severity='error'>Error playing all audio</Alert>)
    }
  };

  const stopAllLayers = () => {
    let keys = Object.keys(layerStore.allLayers)
    keys.forEach((layerKey, i) => {
      let layer = layerStore.allLayers[layerKey]
      layer.stop()
    });
    Tone.Transport.stop();
  };

  const pauseResumeAllLayers = () => {
    if (allLayersPlayState.current === 'started') {
      Tone.Transport.pause();
      allLayersPlayState.current = 'stopped';
    } else if (allLayersPlayState.current === 'stopped') {
      Tone.Transport.start();
      allLayersPlayState.current = 'started';
    }
  };

  const handleSaveClick = async () => {
    try {
      const name = document.getElementById("track-name").value;
      const tag = document.getElementById("track-tag").value;
      const publicity = document.getElementById("track-publicity").checked;
      const metadata = {
        trackName: name,
        public: publicity,
        tag: tag
      };
      if (name === "") {
        snackbar.showMessage(<Alert variant='error'>Please provide a track name</Alert>)
      } else {
        await saveTrackData(layerStore.allLayers, userId, trackId, metadata);
        snackbar.showMessage(<Alert variant='success'>Track saved</Alert>)
      }
    } catch (error) {
      console.log(error)
      snackbar.showMessage(<Alert variant='error'>Track failed to save</Alert>)
    }
  }

  const renderWaveform = (wave, id) => {
    if (wave) {
      let analyser, bufferLength, dataArray;
      const canvas = document.querySelector('.visual-layer' + id);
      const canvasCtx = canvas.getContext('2d');

      analyser = wave._analyser._analysers[0];
      analyser.fftSize = 2048;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const draw = () => {
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = '#FFFFFF';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = '#000000';
        canvasCtx.beginPath();

        let sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          let v = dataArray[i] / 128.0;
          let y = v * canvas.height / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
        window.requestAnimationFrame(draw);
      }
      draw();
    }
  };

  // create refs to be used during cleanup
  useEffect(() => {
    allLayersRef.current = layerStore.allLayers
  }, [layerStore.allLayers]);

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
      <SettingsList importHandler={importHandler} saveHandler={handleSaveClick} uploadHandler={uploadHandler} metadata={trackMetadata}/>
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
        {Object.keys(layerStore.allLayers).map((player, index) => <LayerEditor key={index} id={index} />)}
      </Box>
    </>
  );
}