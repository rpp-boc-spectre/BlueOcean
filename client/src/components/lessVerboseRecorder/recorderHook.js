import { useEffect, useState } from 'react';

const RecordState = () => {
  const [audioURL, setAudioURL] = useState([]);
  const [isRecording, setIsRecording] = useState('');
  const [recorder, setRecorder] = useState(null);
  const [blobs, setBlob] = useState([]);

  let chunks = [];
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

    // const handleData = (e) => {
    //   const newChunk = [e.data];

    //   let blob = new Blob(newChunk, { type: 'audio/mp3' });
    //   setBlob((prevBlobs) => [...prevBlobs, blob]);
    //   setAudioURL((prevUrls) => [...prevUrls, URL.createObjectURL(blob)]);
    // };

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
    console.log('hewerwer',recorder.audioBitsPerSecond)
    setIsRecording('pause');
  };
  const getRecorder = async function () {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true,video:false });
    var options = {
      audioBitsPerSecond : 128000,
      mimeType:'audio/webm;codecs=pcm'
    }
    let mediaRecorder = new MediaRecorder(stream,options);

    mediaRecorder.onstop = async (e) => {
      var blob = new Blob(chunks, { type: 'audio/mp3' });
      var file = new File ([blob],'test.mp3',{
      type: blob.type,
      lastModified: Date.now()
    })
    // var bufferPromise = blob.arrayBuffer()
    var blobBuff = await blob.arrayBuffer()
    var lastDitch = new Int8Array(blobBuff)
    console.log('blobG',blobBuff,lastDitch)


    let fileURL = URL.createObjectURL(file)
      console.log('file',file)
      chunks = [];

      let audioURL = URL.createObjectURL(blob);

      setBlob((prevBlobs) => [...prevBlobs, blob]);
      setAudioURL([fileURL]);

    };

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    return mediaRecorder;
  };

  return [
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    pauseRecording,
    blobs,
  ];
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
// const RecordState = () => {
//   const [audioURL, setAudioURL] = useState([]);
//   const [isRecording, setIsRecording] = useState('');
//   const [recorder, setRecorder] = useState(null);

//   let chunks = []

//   useEffect(() => {
//     if (!recorder) {
//       if (isRecording === 'start') {
//         getRecorder().then(setRecorder, console.error);
//       }
//       return;
//     }
//     isRecording === 'start' && recorder.state === 'paused'
//       ? recorder.resume()
//       : isRecording === 'start'
//         ? recorder.start()
//         : isRecording === 'stop' ? recorder.stop() : recorder.pause()

//     // const handleData = (e) => {
//     //   setAudioURL(() => [URL.createObjectURL(e.data)]);
//     // };

//     // recorder.addEventListener('dataavailable', handleData);
//     // return () => recorder.removeEventListener('dataavailable', handleData);
//   }, [recorder, isRecording]);

//   const startRecording = () => {
//     setIsRecording('start');
//   };

//   const stopRecording = () => {
//     setIsRecording('stop');
//   };

//   const pauseRecording = () => {
//     setIsRecording('pause');
//   };

//   const getRecorder = async function () {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     let mediaRecorder = new MediaRecorder(stream);

//     mediaRecorder.onstop = e => {
//       var blob = new Blob(chunks, { "type": "audio/mp3" });
//       chunks = []
//       let audioURL = URL.createObjectURL(blob)
//       setAudioURL(audioURL);
//     }

//     mediaRecorder.ondataavailable = function (e) {
//       chunks.push(e.data)
//     }

//     return mediaRecorder;
//   };

//   return [audioURL, isRecording, startRecording, stopRecording, pauseRecording];
// };

// export default RecordState;
