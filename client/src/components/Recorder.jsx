import React, { useState, useContext } from 'react';
// import audioBufferToWav from './audioBufferToWav';
import * as Tone from 'tone';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../lib/firebase';
import Typography from '@mui/material/Typography';
import UserContext from '../context/UserContext';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert'
import { useSnackbar } from 'material-ui-snackbar-provider';

export default function RecorderTone(props) {
  const {user, username} = useContext(UserContext);
  const snackbar = useSnackbar();
  const [url, setUrl] = useState(null);
  const [micRecorder, setMicRecorder] = useState();
  const [userMic, setUserMic] = useState();
  const [recordingName, setRecordingName] = useState('');
  const [isFinished, setIsFinished] = useState(false)

  const startRecorder = async function () {
    try {
      await Tone.start();
      setIsFinished(false)
      const recorder = new Tone.Recorder();

      const mic = new Tone.UserMedia().connect(recorder);
      setMicRecorder(recorder);
      setUserMic(mic);

      await mic.open();
      recorder.start();
      console.log('recording');
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

  const handleUploadClick = async () => {
    //TODO, make link dynamic
    try {
      const mp3StorageRef = ref(storage, `audio/${user.uid}/${recordingName}.webm`)
      await  uploadBytes(mp3StorageRef, micRecorder)
      snackbar.showMessage(<Alert severity="success" sx={{ width: '100%' }}>{`Layer Uploaded :)`}</Alert>)
    } catch (error) {
      console.log('upload ', error)
      snackbar.showMessage(<Alert severity="error" sx={{ width: '100%' }}>{`There was an error uploading your layer :(`}</Alert>)
    }
  }

  return (
    <>
    <Typography variant='h3'>Recorder Component</Typography>
    <button onClick={startRecorder}>Click to record</button>
    <button onClick={stopRecorder}>Click to stop</button>

    <button onClick={handleUploadClick} disabled={!isFinished}>Upload</button>
    <TextField variant='outlined' onChange={(e) => {setRecordingName(e.target.value)}}/>
    <br />
    <br />
    <br />
    <audio src={url} controls></audio>
    </>
  );
}