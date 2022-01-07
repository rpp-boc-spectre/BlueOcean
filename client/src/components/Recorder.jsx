import React, { useState, useContext } from 'react';
// import audioBufferToWav from './audioBufferToWav';
import * as Tone from 'tone';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../lib/firebase';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Typography from '@mui/material/Typography';
import UserContext from '../context/UserContext';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert'
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useSnackbar } from 'material-ui-snackbar-provider';
import { getLayerUrl } from '../utils/storage';

export default function RecorderTone({ currentList, setAudioLayers }) {
  const {user, username} = useContext(UserContext);
  const snackbar = useSnackbar();
  const [url, setUrl] = useState(null);
  const [micRecorder, setMicRecorder] = useState();
  const [userMic, setUserMic] = useState();
  const [recordingName, setRecordingName] = useState('');
  const [isFinished, setIsFinished] = useState(false)

  const renderWaveform = (fft) => {
    let analyser, bufferLength, dataArray;
    const canvas = document.querySelector('.visual-layer');
    const canvasCtx = canvas.getContext('2d');

    // console.log('CHECKING FFT IN RENDER', fft);
    analyser = fft._analyser._analysers[0];
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
    };
    draw();
  }

  const startRecorder = async function () {
    try {
      await Tone.start();
      setIsFinished(false)
      const recorder = new Tone.Recorder();
      const mic = new Tone.UserMedia()
      const toneFFT = new Tone.FFT();
      mic.connect(recorder);
      mic.connect(toneFFT);
      setMicRecorder(recorder);
      setUserMic(mic);

      await mic.open();
      recorder.start();
      Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => {
          renderWaveform(toneFFT);
        }, time);
      }, "+0.0005");
      console.log('recording');
      Tone.Transport.start();
    } catch (error) {
      console.log('Start Recorder', error)
    }
  };

  const stopRecorder = async function () {
    try {
      const recording = await micRecorder.stop();
      // close mic on stop.
      await userMic.close();

      // WAV stuff------------------------------------
      // const audioContext = new AudioContext();
      // let blobArrayBuffer = await recording.arrayBuffer();
      // let audioBuffer = await audioContext.decodeAudioData(blobArrayBuffer);
      // let audioBufferToWavJS = audioBufferToWav(audioBuffer);
      // let newBlob = new Blob([audioBufferToWavJS], { type: 'audio/wav' });
      // console.log('REcording',recording.size,'Blob',newBlob.size)
      // ----------------------------------------------

      let newBlobURL = URL.createObjectURL(recording);
      setUrl(newBlobURL)
      setMicRecorder(recording)
      setIsFinished(true)
   } catch (error) {
    console.log('ERROR',error)
   }
  };

  const audioPlayback = async () => {
    await Tone.start();
    const player = new Tone.Player(url).toDestination();

    const wave = new Tone.Waveform();
    player.connect(wave);

    Tone.Transport.schedule((time) => {
      Tone.Draw.schedule(() => {
        // console.log('did we make it inside tone.transport..', wave);
        // player.sync.start();
        renderWaveform(wave);
      }, time);
    }, "+0.005");

    player.sync().start();
    await Tone.loaded();
    Tone.Transport.start();
  }

  const handleUploadClick = async () => {
    //TODO, make link dynamic
    try {
      const mp3StorageRef = ref(storage, `audio/${user.uid}/${recordingName}.webm`)
      await  uploadBytes(mp3StorageRef, micRecorder)
      snackbar.showMessage(<Alert severity="success" sx={{ width: '100%' }}>{`Layer Uploaded :)`}</Alert>)
      let url = await getLayerUrl(mp3StorageRef)
      let data = {
        pitch: 0,
        volume: 0,
        parent: user.uid,
        fileName: `${recordingName}.webm`,
        layerName: recordingName,
        url: url
      }
      setAudioLayers((prevLayers) => {
        return [...prevLayers, data]
      })
    } catch (error) {
      console.log('upload ', error)
      snackbar.showMessage(<Alert severity="error" sx={{ width: '100%' }}>{`There was an error uploading your layer :(`}</Alert>)
    }
  }

  return (
    <>
    <Typography variant='h3'>Recorder Component</Typography>
    <Button variant='outlined' onClick={startRecorder} startIcon={<MicIcon />} disabled={isFinished === false && !!micRecorder}>Click to record</Button>
    <Button variant='outlined' onClick={stopRecorder} endIcon={<StopCircleIcon />} disabled={isFinished === true || !micRecorder}>Click to stop</Button>
    <ValidatorForm onSubmit={handleUploadClick}>
      <TextValidator
        label="Layer Name"
        onChange={e => {setRecordingName(e.target.value)}}
        name="layer name"
        value={recordingName}
        validators={['required']}
        errorMessages={['this field is required']}
      />
      <Button variant="contained" type="submit" disabled={!isFinished}>Upload</Button>
    </ValidatorForm>
    <br />
    <br />
    <br />
    <audio src={url} onPlay={audioPlayback} controls></audio>
    <canvas className='visual-layer' width='350' height='75'></canvas>
    </>
  );
}