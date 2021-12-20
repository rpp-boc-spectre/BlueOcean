import { useEffect, useState } from 'react';

const RecordState = () => {
  const [audioURL, setAudioURL] = useState([]);
  const [isRecording, setIsRecording] = useState('');
  const [recorder, setRecorder] = useState(null);
  const [blob,setBlob] =useState(null)
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

    const handleData = (e) => {
      const newChunk = [e.data];

      let blob = new Blob(newChunk, { type: 'audio/mp3' });
      setBlob((prevBlobs)=>[...prevBlobs,blob])
      setAudioURL((prevUrls) => [...prevUrls, URL.createObjectURL(blob)]);
    };

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
    setIsRecording('pause');
  };

  return [
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    pauseRecording,
    blob
  ];
};



const getRecorder = async function () {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  let mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.onstop = e => {
    var blob = new Blob(chunks, { "type": "audio/mp3" });
    chunks = []
    let audioURL = URL.createObjectURL(blob)
    setAudioURL(audioURL);
  }

  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data)
  }

  return mediaRecorder;
};

// const getRecorder = async function () {
//   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//   let mediaRecorder = new MediaRecorder(stream);



//   return mediaRecorder;
// };

export default RecordState;

// original if statment replaced by ternary operator
// if (isRecording === 'start') {
//   if (recorder.state === 'paused') {
//     recorder.resume();
//   } else {
//     recorder.start();
//   }
// } else if (isRecording === 'stop') {
//   recorder.stop();
// } else {
//   if (isRecording === 'pause') {
//     recorder.pause();
//   }
// }
const RecordState = () => {
  const [audioURL, setAudioURL] = useState([]);
  const [isRecording, setIsRecording] = useState('');
  const [recorder, setRecorder] = useState(null);

  let chunks = []

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
        : isRecording === 'stop' ? recorder.stop() : recorder.pause()

    // const handleData = (e) => {
    //   setAudioURL(() => [URL.createObjectURL(e.data)]);
    // };

    // recorder.addEventListener('dataavailable', handleData);
    // return () => recorder.removeEventListener('dataavailable', handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording('start');
  };

  const stopRecording = () => {
    setIsRecording('stop');
  };

  const pauseRecording = () => {
    setIsRecording('pause');
  };

  const getRecorder = async function () {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    let mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstop = e => {
      var blob = new Blob(chunks, { "type": "audio/mp3" });
      chunks = []
      let audioURL = URL.createObjectURL(blob)
      setAudioURL(audioURL);
    }

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data)
    }

    return mediaRecorder;
  };

  return [audioURL, isRecording, startRecording, stopRecording, pauseRecording];
};


export default RecordState;