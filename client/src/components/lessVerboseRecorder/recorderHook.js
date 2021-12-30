import { useEffect, useState } from 'react';

import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../lib/firebase';
import testingMp3 from '../../testing.mp3';
import audioBufferToWav from '../recorderTone/audioBufferToWav';
const RecordState = () => {
  const [audioURL, setAudioURL] = useState([]);
  const [isRecording, setIsRecording] = useState('');
  const [recorder, setRecorder] = useState(null);
  const [blobs, setBlob] = useState([]);

  let chunks = [];
  useEffect(() => {
    if (!recorder) {
      if (isRecording === 'start') {
        getRecorder().then(setRecorder, console.error);
      }
      return;
    }
    isRecording === 'start' && recorder.state === 'paused'
      ? recorder.resume()
      : isRecording === 'start'
      ? recorder.start()
      : isRecording === 'stop'
      ? recorder.stop()
      : recorder.pause();

    // const handleData = (e) => {
    //   const newChunk = [e.data];

    //   let blob = new Blob(newChunk, { type: 'audio/mp3' });
    //   setBlob((prevBlobs) => [...prevBlobs, blob]);
    //   setAudioURL((prevUrls) => [...prevUrls, URL.createObjectURL(blob)]);
    // };

    // recorder.addEventListener('dataavailable', handleData);

    // return () =>  recorder.removeEventListener('dataavailable', handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording('start');
  };

  const stopRecording = () => {
    setIsRecording('stop');
  };

  const pauseRecording = () => {
    console.log('hewerwer', recorder.audioBitsPerSecond);
    setIsRecording('pause');
  };
  const getRecorder = async function () {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    var options = {
      audioBitsPerSecond: 128000,
      mimeType: 'audio/webm;codecs=pcm',
    };
    let mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.onstop = async (e) => {
      var blob = new Blob(chunks, { type: 'audio/mp3' });
      const audioContext = new AudioContext();

      try {
        let blobArrayBuffer = await blob.arrayBuffer();
        let audioBuffer = await audioContext.decodeAudioData(blobArrayBuffer);
        let audioBufferToWavJS = audioBufferToWav(audioBuffer);
        let newBlob = new Blob([audioBufferToWavJS], { type: 'audio/wav' });

        console.log('recorderHook',newBlob)
        let newBlobURL = URL.createObjectURL(newBlob);
        setBlob((prevBlobs) => [...prevBlobs, blob]);
        setAudioURL([newBlobURL]);
      } catch (error) {
        console.log(error)
        return
      }


    };

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    return mediaRecorder;
  };

  return [
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    pauseRecording,
    blobs,
  ];
};

// const getRecorder = async function () {
//   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//   let mediaRecorder = new MediaRecorder(stream);

//   return mediaRecorder;
// };

export default RecordState;

