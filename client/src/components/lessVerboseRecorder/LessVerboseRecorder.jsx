import * as React from 'react';
import RecorderHook from './recorderHook.js';
export default function LessVerboseRecorder() {
  let [audioUrl, isRecording, startRecording, stopRecording, pauseRecording] =
    RecorderHook();
  //  console.log('audioUrl',audioUrl)
  return (
    <div>
      <label>Record Audio</label>
      <br/>
      {audioUrl.map((track, i) => {
        console.log('track',track)
        return <audio key={i} src={track} type='audio/mp3' controls></audio>;
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
    </div>
  );
}
