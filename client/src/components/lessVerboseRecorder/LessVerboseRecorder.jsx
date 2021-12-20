import  React,{useState,useEffect} from 'react';
import RecorderHook from './recorderHook.js';
import * as Tone from 'tone'
import axios from 'axios';
export default function LessVerboseRecorder() {
  let [audioUrl, isRecording, startRecording, stopRecording, pauseRecording,blob] =
    RecorderHook();
// useEffect(()=>{

//   console.log('effect',blob)
// })

const sendURL = function(e){
 e.preventDefault()
  axios.post('/audioUrls',blob).then((results)=>{
    console.log('results',results)
  }).catch(err=>console.log('error',err))
}
  return (
    <div>
      <label>Record Audio</label>
      <br/>
      {audioUrl.map((track, i) => {
        console.log('track',track)
        return <audio key={i} src={track} controls></audio>;
      })}
      <button onClick={startRecording} disabled={isRecording === 'start'}>
        start recording
      </button>


      <button
        onClick={stopRecording}
        disabled={isRecording === 'stop' || isRecording === ''}>
        stop recording
      </button>
      <button
        onClick={pauseRecording}
        disabled={
          isRecording === 'stop' ||
          isRecording === 'pause' ||
          isRecording === ''
        }>
        pause recording
      </button>
        <button onClick={sendURL}>Send to Back End</button>
    </div>
  );
}
