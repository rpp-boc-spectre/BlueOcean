import React, { useEffect, useState, useRef } from 'react';

import * as Tone from 'tone';
import { UserMedia } from 'tone';

import { saveTrackData } from '../utils/database.js';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useSnackbar } from 'material-ui-snackbar-provider';

import LayerEditor from './LayerEditor.jsx';
import TimeControlBox from './editorComponents/TimeControlBox.jsx';
import SettingsList from './editorComponents/SettingsList.jsx';


export default function LayerPlayer({ layers, trackId, userId, recordingHandler, importHandler }) {
  const [allLayers, setAllLayers] = useState([]);
  const allLayersPlayState = useRef('');
  const snackbar = useSnackbar()


  const playAllLayers = async () => {
    await Tone.start();
    allLayers.forEach((layer, i) => {
      console.log('play all: ', layer)
      layer.props.layerPlayer.sync().stop();
      console.log('CHECKING PROPS', document.querySelector('.visual-layer' + layer.props.id));
      Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => {
          // console.log('TONE DRAW TIME', time);
          renderWaveform(layer.props.waveform, layer.props.id);
        }, time);
      }, "+0.005");
      layer.props.layerPlayer.sync().start();
    });
    await Tone.loaded();
    allLayersPlayState.current = 'started';
    Tone.Transport.start();
  };

  const stopAllLayers = () => {
    Tone.Transport.stop();
    allLayers.forEach((layer, i) => {
      layer.props.layerPlayer.unsync();
    });
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
    console.log('click')
    let trackData = {
      user: userId,
      layers: []
    }

    for (var layer of allLayers) {
      let data = {
        start: 0,
        end: 0,
        duration: 0,
        pitch: layer.props.pitchShift._pitch,
        volume: layer.props.layerVolume.volume.value,
        fileName: layer.props.layerData.fileName,
        parent: layer.props.layerData.parent,
        layerName: layer.props.layerData.layerName || layer.props.layerData.fileName.split('.webm')[0]
      }
      trackData.layers.push(data)
    }

    try {
      await saveTrackData(trackData, trackId)
      snackbar.showMessage(<Alert variant='success'>Track saved</Alert>)
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
          let y = v * canvas.height/2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
        window.requestAnimationFrame(draw);
      }
      draw();
    }
  };

  useEffect(() => {
    // for right meow, calling this function instead of fetching data
    layerMaker();
  }, [layers]);

  const layerMaker = async() => {

    let layerEditorComponents = layers.map((layer, index) => {
      console.log(layer)
      var newPlayer = new Tone.Player(layer.url)
      const pitchShift = new Tone.PitchShift(layer?.pitch || 0).toDestination();
      const volume = new Tone.Volume(layer?.volume || -5)
      volume.connect(pitchShift)
      newPlayer.connect(volume)
      const toneWaveform = new Tone.Waveform();
      newPlayer.connect(toneWaveform);

      // do not sync players here in order to maintain individual player control
      return (
          <LayerEditor
            key={index}
            id={index}
            layerPlayer={newPlayer}
            pitchShift={pitchShift}
            pitch={layer.pitch}
            layerVolume={volume}
            volume={layer.volume}
            layerData={layer}
            waveform={toneWaveform}
          />
      );
    });

    // save created layers in state so that we can sync them to play all together in playAllLayers()
    setAllLayers((prevLayers) => layerEditorComponents);
  };

  return (
    <>
      <SettingsList importHandler={importHandler} saveHandler={handleSaveClick}/>
      <TimeControlBox recordingHandler={recordingHandler} playAllHandler={playAllLayers} stopAllHandler={stopAllLayers} pauseResumeHandler={pauseResumeAllLayers} />
      <Box
        sx={{
          bgcolor: 'background.paper',
          gridColumn: {xs: '1 / 3', md:'2'},
          gridRow: {xs: '1', md: '1 / 3'},
          minHeight: '60vh',
          maxHeight: '80vh',
          padding: {xs: '0', md: '10px'},
        }}
      >
      {allLayers}
      </Box>
    </>
  );
}


/* <button onClick={playAllLayers}>Play All Layers</button>
<button onClick={stopAllLayers}>Stop All Layers</button>
<button onClick={pauseResumeAllLayers}>Pause/Resume</button>
<button onClick={handleSaveClick}>Save Changes</button>
 */