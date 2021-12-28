import React, { Component, useState, useEffect, useRef } from 'react';
import * as lamejs from 'lamejs';
import * as Tone from 'tone';

export default function RecorderTone(props) {
  const [url, setUrl] = useState(null);
  const [micRecorder, setMicRecorder] = useState();
  const [userMic, setUserMic] = useState();
  const chunks = [];

  const startRecorder = async function () {
    const recorder = new Tone.Recorder();
    // recorder.ondataavailable = evt => chunks.push(evt.data);

    // recorder.onstop = evt => {
    //   // let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
    //   // audio.src = URL.createObjectURL(blob);
    //   console.log('chunks',chunks)
    // };

    const mic = new Tone.UserMedia().connect(recorder);
    setMicRecorder(recorder);
    setUserMic(mic);
    await Tone.start();
    await mic.open();

    recorder.start();
    console.log('recording');
  };




  const stopRecorder = async function () {
    const recording = await micRecorder.stop();
    userMic.close();
    // console.log('MICRECORDER', chunks);
    console.log('recording!!!!', recording);




     const url = URL.createObjectURL(recording);

    setUrl(url);
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
