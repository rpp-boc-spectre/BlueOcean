import React, { useState, useContext, useRef, useEffect } from 'react';
// import audioBufferToWav from './audioBufferToWav';
import * as Tone from 'tone';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { useLayerStore } from '../context/LayerContext.js'

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import UserContext from '../context/UserContext';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert'
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import Switch from '@mui/material/Switch';

import toast from 'react-hot-toast';
import { getLayerUrl } from '../utils/storage';
import { Timer } from '../utils/recorder';

export default function RecorderTone({ currentList, setAudioLayers }) {
  const { user, username } = useContext(UserContext);
  const [url, setUrl] = useState(null);
  const [micRecorder, setMicRecorder] = useState();
  const [userMic, setUserMic] = useState();
  const [recordingName, setRecordingName] = useState('');
  const [isFinished, setIsFinished] = useState(false)
  const recordingLimit = useRef(30)
  const [timeRemaining, setTimeRemaining] = useState(recordingLimit.current)
  const micRecorderRef = useRef()
  const userMicRef = useRef()
  const updateTimerRef = useRef()
  const recorderTimeoutRef = useRef()
  const [layerStore, dispatch] = useLayerStore()
  const [playWith, setPlayWith] = useState(true)
  const [countDown, setCountDown] = useState(false)
  const [countDownLimit, setCountDownLimit] = useState(6)
  const [currentCountDown, setCurrentCountDown] = useState(countDownLimit)
  const countDownTimerRef = useRef();

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
      if (playWith && layerStore.player) {
        layerStore.player.start()
      }
      startTimer();
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
      const recording = await micRecorderRef.current.stop();
      // close mic on stop.
      await userMicRef.current.close();
      if (playWith && layerStore.player) {
        layerStore.player.stop()
      }
      let newBlobURL = URL.createObjectURL(recording);
      setUrl(newBlobURL)
      setMicRecorder(recording)
      setIsFinished(true)
      recorderTimeoutRef.current.pause()
    } catch (error) {
      console.log('ERROR', error)
    }
  };

  const startTimer = () => {
    setTimeRemaining(recordingLimit.current)
    let recorderTimeout = new Timer(async () => {
      try {
        stopRecorder()
        clearInterval(updateTimerRef.current)
        setTimeRemaining(recordingLimit.current)
      } catch (error) {
        console.log(error)
      }
    }, (recordingLimit.current * 1000) + 400)

    let updateTimer = setInterval(function () {
      let time = recorderTimeoutRef.current.getTimeLeft();
      setTimeRemaining((time / 1000));
    }, 90);

    updateTimerRef.current = updateTimer
    recorderTimeoutRef.current = recorderTimeout
  }

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
    try {
      const mp3StorageRef = ref(storage, `audio/${user.uid}/${recordingName}.webm`)
      await uploadBytes(mp3StorageRef, micRecorder)
      toast.custom(<Alert variant='filled' severity="success" color='primary'>{`Layer Uploaded :)`}</Alert>)
      let url = await getLayerUrl(mp3StorageRef)
      let data = {
        parent: user.uid,
        fileName: `${recordingName}.webm`,
        layerName: recordingName,
        url: url
      }

      // make sure we are not already capped on layers before adding them to the editor
      if ((currentList?.length || 0) < 4) {
        setAudioLayers((prevLayers) => {
          if (layerStore.player) {
            layerStore.player.reload([...prevLayers, data])
          }
          return [...prevLayers, data]
        })
      }
    } catch (error) {
      toast.custom(<Alert variant='filled' severity="error">{`There was an error uploading your layer :(`}</Alert>)
    }
  }

  const handleRecordClick = () => {
    setCountDown(true)
    let timer = new Timer(() => {
      clearInterval(updateTimerRef.current)
      setCountDown(false)
      startRecorder()
    }, countDownLimit * 1000)

    let updater = setInterval(() => {
      let timeRemaining = countDownTimerRef.current.getTimeLeft()
      setCurrentCountDown(timeRemaining)
    }, 50)

    countDownTimerRef.current = timer
    updateTimerRef.current = updater
  }

  useEffect(() => {
    if (userMic instanceof Blob) {
      micRecorderRef.current = null
    } else {
      micRecorderRef.current = micRecorder;
    }
  }, [micRecorder])

  useEffect(() => {
    if (userMic instanceof Blob) {
      userMicRef.current = null;
    } else {
      userMicRef.current = userMic;
    }
  }, [userMic])

  useEffect(() => {
    return () => {
      if (recorderTimeoutRef.current) {
        recorderTimeoutRef.current.pause()
      }

      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current)
      }

      if ((micRecorderRef.current !== null) && !(micRecorderRef.current instanceof Blob) && micRecorderRef.current !== undefined) {
        micRecorderRef.current.dispose();
      }
      // close mic on stop.
      if (userMicRef.current !== null && micRecorderRef.current !== undefined) {
        userMicRef.current.close();
      }
    }
  }, [])

  return (
    <>
      <Switch checked={playWith} onChange={() => { setPlayWith((prev) => !prev) }} />
      {(!!micRecorder && !isFinished) && <Typography>{`${Math.abs(timeRemaining - recordingLimit.current).toFixed(2)} / ${recordingLimit.current}:00`}</Typography>}
      {(countDown) && <Typography>{(currentCountDown / 1000).toFixed(2)}</Typography>}
      <Button variant='outlined' onClick={handleRecordClick} startIcon={<MicIcon />} disabled={isFinished === false && !!micRecorder}>Click to record</Button>
      <Button variant='outlined' onClick={stopRecorder} endIcon={<StopCircleIcon />} disabled={isFinished === true || !micRecorder}>Click to stop</Button>
      <ValidatorForm onSubmit={handleUploadClick}>
        <TextValidator
          label="Layer Name"
          onChange={e => { setRecordingName(e.target.value) }}
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