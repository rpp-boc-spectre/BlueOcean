import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MicRecorder from 'mic-recorder-to-mp3';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../lib/firebase';
import testingMp3 from '../../testing.mp3';
import { async } from '@firebase/util';
import {Buffer} from 'buffer'
import getBlobDuration from 'get-blob-duration';
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

// const myAudioContext = new (window.AudioContext || window.webkitAudioContext)();
export default function MP3RecorderEncoder(props) {
  const newAudio = new Audio(testingMp3)
console.log('testing',newAudio.duration)
  const [isRecording, setIsRecording] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blob, setBlob] = useState([]);
  const [blobURL, setBlobURL] = useState('');
  // async needs to be internal function. useEffect(async()=>{}) is anti-pattern
  useEffect(() => {
   (async () => {
      const recorder = await navigator.mediaDevices.getUserMedia(
        { audio: true, video: false },
        (recorder) => {
          setIsBlocked(false);
        },
        () => {
          // add some UI to remind user they must enable mic if they want to record
          console.log('Permission Denied');
          setIsBlocked(true);
        }
      );
      if (recorder) {
        console.log('Permission Granted');
        setIsBlocked(false);
      } else {
        console.log('Permission Denied');
        setIsBlocked(true);
      }
    })();

  });
  const start = () => {
    if (isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
        })
        .catch((e) => console.error(e));
    }
  };

  const stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        // get track duration
        console.log('MP3',blob.size)
        let mp3BLOB = new Blob(buffer,{type:'audio/mp3'})
        console.log('BUFFER',mp3BLOB.size, blob.size)
        let trackTime = await getBlobDuration(blob);
        // create objectURL
        let newBlobURL = URL.createObjectURL(blob);
        //set blob url to page:
        // setBlobURL(newBlobURL);
        setBlobURL(newBlobURL)
        setBlob(newBlobURL)
        // send the file somewhere
        const mp3StorageRef = ref(storage, 'audio/HVA5M5IcFWT5IliCKV4212EMw4o1/testAudio.mp3')
        return uploadBytes(mp3StorageRef, blob)

        // send needs to be fired by user actually saving track instead of just stopping.
        // when user saves, send to backend to tag then do above firebaseStorage from backend

      })
      .then((snapshot) => {
        console.log('Recording uploaded: ', snapshot)
      })
      .catch((e) => console.log(e));
  };
  const send = ( blob) => {
    axios
      .post('/audioUrls', blob)
      .then((results) => {
        console.log('results', results);
        // let fileBuffer = Buffer.from(JSON.parse(results.data.blob))
        // console.log('fileBuffer',fileBuffer)
        // let responseBlob = URL.createObjectURL(results.data.blob)
        setBlobURL(responseBlob)
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  return (
    <div>
      <header>
        <button onClick={start}>Record</button>
        <button onClick={stop} disabled={!isRecording}>
          Stop
        </button>

        <audio id='audio' src={blobURL} controls='controls' />
      </header>
      <a href={blobURL} download='testing.mp3'>
        Download
      </a>
    </div>
  );
}

/*
const getData = async (e) => {
    // e.preventDefault();
    var audioContext = new AudioContext();
    console.log('er')
    var request =  new XMLHttpRequest();
    request.open(
      'GET',
      'http://localhost:3000/ddb8ecf8329444d46488913f23d2048f.mp3',
      false
    );
    request.responseType = 'arraybuffer';
    request.onload = ()=> {
      console.log('@@@@@@@')
      audioContext.decodeAudioData(request.response, (buffer)=> {
        // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
        var duration = buffer.duration;

        // example 12.3234 seconds
        console.log('The duration of the song is of: ' + duration + ' seconds');
        // Alternatively, just display the integer value with
        // parseInt(duration)
        // 12 seconds
      });
      request.send();
    };



      <button onClick={getData}>Get data</button>





            // myAudioContext
        //   .decodeAudioData(buffer)
        //   .then((decoded) => {
        //     console.log('duration', decoded.duration);
        //   })
        //   .catch((err) => console.log('error', err));
        // console.log('buffer', blob, buffer);
  };




       // const audioTest = new Audio()
        // audioTest.src= fileURL
        // console.log('audio',audioTest.duration)

        // send(blob)

WORKS ON SECOND RENDER
   let audio = document.getElementById('audio');
    console.log('audioduration', audio.duration);






        // blob.arrayBuffer()
        // var reader = new FileReader()

        // reader.readAsArrayBuffer(blob)
        // console.log(Mp3Recorder,'mp3Stop')
        // create a file from the buffer, feed in a name set by openNamingForm function

        const file = new File(buffer, 'me-at-thevoice.mp3', {
          type: blob.type,
          lastModified: Date.now(),
        });
        // const player = new Audio(URL.createObjectURL(file));
        // console.log('player',player.duration)


        // reader.readAsDataURL([testingMp3]);
        // reader.onload = function () {
        //   console.log('Rsu', reader.result.duration);
        //   setFile(reader.result);
        // };
        let newBlobURL = URL.createObjectURL(blob);
        let newFileUrl = URL.createObjectURL(file);

        setBlobURL(newBlobURL);
        setFileURL(newFileUrl);




               //   (async function() {
        //   const trackTime = getBlobDuration(blob).then((duration)=>{

        //  testDuration = duration
        //   })
        //   // console.log(duration + ' seconds',"STOP",Mp3Recorder.context.currentTime)




        // })()

  */
