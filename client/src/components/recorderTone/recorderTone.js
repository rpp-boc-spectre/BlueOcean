import React, { useState } from 'react';
import axios from 'axios'
import audioBufferToWav from './audioBufferToWav';
import * as Tone from 'tone';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../lib/firebase';
import testingMp3 from '../../testing.mp3';
export default function RecorderTone(props) {
  const [url, setUrl] = useState(null);
  const [micRecorder, setMicRecorder] = useState();
  const [userMic, setUserMic] = useState();
  const chunks = [];

  const startRecorder = async function () {
    await Tone.start();
    const recorder = new Tone.Recorder();

    const mic = new Tone.UserMedia().connect(recorder);
    setMicRecorder(recorder);
    setUserMic(mic);

    await mic.open();
    recorder.start();
    console.log('recording');
  };

  const stopRecorder = async function () {
    const recording = await micRecorder.stop();
    await userMic.close();

    const audioContext = new AudioContext();

    let blobArrayBuffer = await recording.arrayBuffer();
    let audioBuffer = await audioContext.decodeAudioData(blobArrayBuffer);
    let audioBufferToWavJS = audioBufferToWav(audioBuffer);
    let newBlob = new Blob([audioBufferToWavJS], { type: 'audio/wav' });
    console.log('REcording',recording.size,'Blob',newBlob.size)
    let newBlobURL = URL.createObjectURL(newBlob);



   try {
    const mp3StorageRef = ref(storage, 'audio/HVA5M5IcFWT5IliCKV4212EMw4o1/testAudio.wav')
    const testing =  await  uploadBytes(mp3StorageRef, newBlob)
    console.log("SNAPSHOT",testing)
   } catch (error) {
    console.log('ERROR',error)

   }


    // setUrl(newBlobURL);
    // send(recording);
  };
  const send = (blob) => {
    axios
      .post('/audioUrls', blob)
      .then((results) => {
        console.log('results', results);
        // let fileBuffer = Buffer.from(JSON.parse(results.data.blob))
        // console.log('fileBuffer',fileBuffer)
        // let responseBlob = URL.createObjectURL(results.data.blob)
        setBlobURL(responseBlob);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <div>
      <button onClick={startRecorder}>Click to record</button>
      <button onClick={stopRecorder}>Click to stop</button>

      <br />
      <br />
      <br />
      <audio src={url} controls></audio>
    </div>
  );
}

//   function audioBufferToWav(aBuffer) {
//     let numOfChan = 1,
//         btwLength = aBuffer.length * numOfChan * 2 + 44,
//         btwArrBuff = new ArrayBuffer(btwLength),
//         btwView = new DataView(btwArrBuff),
//         btwChnls = [],
//         btwIndex,
//         btwSample,
//         btwOffset = 0,
//         btwPos = 0;
//     setUint32(0x46464952); // "RIFF"
//     setUint32(btwLength - 8); // file length - 8
//     setUint32(0x45564157); // "WAVE"
//     setUint32(0x20746d66); // "fmt " chunk
//     setUint32(16); // length = 16
//     setUint16(1); // PCM (uncompressed)
//     setUint16(numOfChan);
//     setUint32(aBuffer.sampleRate);
//     setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
//     setUint16(numOfChan * 2); // block-align
//     setUint16(16); // 16-bit
//     setUint32(0x61746164); // "data" - chunk
//     setUint32(btwLength - btwPos - 4); // chunk length

//     for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
//         btwChnls.push(aBuffer.getChannelData(btwIndex));

//     while (btwPos < btwLength) {
//         for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
//             // interleave btwChnls
//             btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
//             btwSample = (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
//             btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
//             btwPos += 2;
//         }
//         btwOffset++; // next source sample
//     }

//     let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));
//     let wavSamples = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);

//    return wavToMp3(wavHdr.channels, wavHdr.sampleRate, wavSamples);

//     function setUint16(data) {
//         btwView.setUint16(btwPos, data, true);
//         btwPos += 2;
//     }

//     function setUint32(data) {
//         btwView.setUint32(btwPos, data, true);
//         btwPos += 4;
//     }
//   }

//   function wavToMp3(channels, sampleRate, samples) {
//     var buffer = [];
//     var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
//     var remaining = samples.length;
//     var samplesPerFrame = 1152;
//     for (var i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
//         var mono = samples.subarray(i, i + samplesPerFrame);
//         var mp3buf = mp3enc.encodeBuffer(mono);
//         if (mp3buf.length > 0) {
//             buffer.push(new Int8Array(mp3buf));
//         }
//         remaining -= samplesPerFrame;
//     }
//     var d = mp3enc.flush();
//     if(d.length > 0){
//         buffer.push(new Int8Array(d));
//     }

//     var mp3Blob = new Blob(buffer, {type: 'audio/mp3'});
//     var bUrl = URL.createObjectURL(mp3Blob);

//     // send the download link to the console
//     console.log('mp3 download:', bUrl);
//     return bUrl

//   }

/*

const lameAttempt = (buffer) => {
    var mp3encoder = new lamejs.Mp3Encoder(1, 44100, 128); //mono 44.1khz encode to 128kbps


    const samples = buffer
    const sampleBlockSize = 1152;
    var mp3Data = [];
    for (var i = 0; i < samples.length; i += sampleBlockSize) {
      var sampleChunk = samples.subarray(i, i + sampleBlockSize);
      var mp3buf = mp3encoder.encodeBuffer(sampleChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }

    var mp3buf = mp3encoder.flush(); //finish writing mp3

    if (mp3buf.length > 0) {
      mp3Data.push(new Int8Array(mp3buf));
    }

    var blob = new Blob(mp3Data, { type: 'audio/mp3' });
    var url = URL.createObjectURL(blob);
    setUrl(url);

  };
 recording.arrayBuffer().then((buffer)=>{
  const data = new Int16Array(buffer);
  lameAttempt(data);
 })
    const samp = new Uint8Array(buffer)

*/
// export default function RecorderTone(props) {
//   const [url, setUrl] = useState(null);

//   const recorder = new Tone.Recorder()
//   const mic = new Tone.UserMedia().connect(recorder);
//   const playRecorder = async function () {
//    await Tone.start()
//     recorder.start()
//     await mic.open()

//     console.log('recording')
//   };

//   const stopRecorder = async function () {
//      mic.close()
//     const recording = await recorder.stop();
//     console.log('recod',recording)
//     let newUrl = URL.createObjectURL(recording);
//     // const audio = new Audio(newUrl);
//     console.log('audio',newUrl)
//     setUrl(newUrl);
//   };

//   return (
//     <div>
//       <button onClick={playRecorder}>Click to record</button>
//       <button onClick={stopRecorder}>Click to stop</button>

//       <br />
//       <br />
//       <br />
//       <audio src={url} controls ></audio>
//     </div>
//   );
// }
