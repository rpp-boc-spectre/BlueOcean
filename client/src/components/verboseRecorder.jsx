import React, { Component, useState, useEffect, useRef } from 'react';

export default function VerboseRecorder() {

    const [audio, setAudio] = useState([])
    const [recording, setRecording] = useState(null)



    const recordAudio = () =>
    new Promise(async resolve => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
        console.log('audioChunks',audioChunks)
      });

      const start = () => mediaRecorder.start();

      const stop = () =>
        new Promise(resolve => {
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks,{type:'audio/mpeg-3'});

            console.log('audioBlob',audioBlob)
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            const play = () => audio.play();
            resolve({ audioBlob, audioUrl, play });
          });

          mediaRecorder.stop();
        });

      resolve({ start, stop });
    });

    let recorderR;
    const startRecording = async () => {
      const recorder = await recordAudio()
      recorder.start()
    setRecording(recorder)
    }

    const stopRecording = async ()  =>{
      console.log('recording',recording)
      if(recording.RecordState ==='inactive' ) {return}
      const audio = await recording.stop()
      setAudio((prevAudio) => [...prevAudio,audio])
      // audio.play()
    }

    return (
      <div>
        <button onClick={startRecording}>Start! </button>
        <button onClick={()=>stopRecording()}>Stop! </button>
        <button onClick={()=>{return audio.forEach((track) => track.play())}}>play</button>

        {/* <audio src={audio} controls></audio> */}

        {audio.map((track,i)=>{
          return (
          <audio src={track.audioUrl} key={i} controls ></audio>)
        })}

      </div>
    );
  }