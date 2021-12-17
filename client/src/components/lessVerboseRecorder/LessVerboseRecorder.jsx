import * as React from 'react';
import RecorderHook from './recorderHook.js'
export default function LessVerboseRecorder() {
    let [audioUrl, isRecording, startRecording, stopRecording] = RecorderHook();

    return (
      <div>
        {audioUrl.map((track, i) => {
          return <audio src={track} controls></audio>;
        })}
        <button onClick={startRecording} disabled={isRecording}>
          start recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          stop recording
        </button>
      </div>
    );
  }
