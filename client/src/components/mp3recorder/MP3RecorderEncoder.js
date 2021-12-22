import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MicRecorder from 'mic-recorder-to-mp3';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default function MP3RecorderEncoder(props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [file, setFile] = useState('');
  const [blob, setBlob] = useState([]);
  const [blobURL, setBlobURL] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(async () => {
    await navigator.mediaDevices.getUserMedia(
      { audio: true },
      () => {
        // add some UI to let the user know they can record
        // note: If deployed on https a dialog box should open and this may not be neccesary
        console.log('Permission Granted');
        setIsBlocked(false);
      },
      () => {
        // add some UI to remind user they must enable mic if they want to record
        console.log('Permission Denied');
        setIsBlocked(true);
      }
    );
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

  const openNamingForm = () => {
    // need some kind of modal or form to name the file
  };

  const stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        // create a file from the buffer, feed in a name set by openNamingForm function
        console.log('blobtype', blob,'buffer',buffer);
        const file = new File(buffer, 'me-at-thevoice.mp3', {
          type: blob.type,
          lastModified: Date.now(),
        });

        let reader = new FileReader(blob);
        reader.readAsDataURL(blob);
        reader.onload = function () {
          console.log('Rsu', reader);
          setFile(reader.result);
        };
        console.log('file', file);
        let newBlobURL = URL.createObjectURL(blob);
        let newFileUrl = URL.createObjectURL(file);
        setBlobURL(newBlobURL);
        setFileURL(newFileUrl);

        // send the file somewhere
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <header>
        <button onClick={start}>Record</button>
        <button onClick={stop} disabled={!isRecording}>
          Stop
        </button>

        <audio src={fileURL} controls='controls' />
      </header>

      {
        // just for testing purposes
        // users will not be able to download files
      }
      <a
        href={file}
        download='testing.mp3'>
        Download
      </a>
    </div>
  );
}
