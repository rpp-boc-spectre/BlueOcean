import React, { Component, useState, useEffect, useRef } from 'react';

import * as Tone from 'tone';

export default function RecorderTone(props) {
  const [url, setUrl] = useState(null);

  const recorder = new Tone.Recorder()
  const mic = new Tone.UserMedia().connect(recorder);
  const playRecorder = async function () {

    recorder.start()
    await mic.open()


    console.log('recording')
  };

  const stopRecorder = async function () {
     mic.close()
    const recording = await recorder.stop();
    console.log('recod',recording)
    let newUrl = URL.createObjectURL(recording);
    // const audio = new Audio(newUrl);
    console.log('audio',newUrl)
    setUrl(newUrl);
  };

  return (
    <div>
      <button onClick={playRecorder}>Click to record</button>
      <button onClick={stopRecorder}>Click to stop</button>

      <br />
      <br />
      <br />
      <audio src={url} controls ></audio>
    </div>
  );
}
