import { useEffect, useState } from 'react';
import audioBufferToWav from 'audiobuffer-to-wav';
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
    console.log('hewerwer', recorder.audioBitsPerSecond);
    setIsRecording('pause');
  };
  const getRecorder = async function () {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    var options = {
      audioBitsPerSecond: 128000,
      mimeType: 'audio/webm;codecs=pcm',
    };
    let mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.onstop = async (e) => {
      var blob = new Blob(chunks, { type: 'audio/mp3' });
      var file = new File([blob], 'test.mp3', {
        type: blob.type,
        lastModified: Date.now(),
      });

      const audioContext = new AudioContext();
      let test = await blob.arrayBuffer();

      let test2 = await audioContext.decodeAudioData(test);
      let audioBufferToWavNPM = audioBufferToWav(test2);
      let audioBufferToWavJS = audioBufferToWav2(test2);
      let newBlob = new Blob([audioBufferToWavJS], { type: 'audio/wav' });
      // let blobView = new DataView(newBlob)
      console.log('newBlob', newBlob);

      let newBlobURL = URL.createObjectURL(newBlob);
      // console.log('TEST1',audioBufferToWav2(test2))
      // console.log('TEST2',audioBufferToWav(test2))

      let fileURL = URL.createObjectURL(file);

      let audioURL = URL.createObjectURL(blob);

      setBlob((prevBlobs) => [...prevBlobs, blob]);
      setAudioURL([newBlobURL]);
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
function audioBufferToWav2(aBuffer) {
  let numOfChan = aBuffer.numberOfChannels,
    btwLength = aBuffer.length * numOfChan * 2 + 44,
    btwArrBuff = new ArrayBuffer(btwLength),
    btwView = new DataView(btwArrBuff),
    btwChnls = [],
    btwIndex,
    btwSample,
    btwOffset = 0,
    btwPos = 0;
  setUint32(0x46464952); // "RIFF"
  setUint32(btwLength - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(aBuffer.sampleRate);
  setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit
  setUint32(0x61746164); // "data" - chunk
  setUint32(btwLength - btwPos - 4); // chunk length

  for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
    btwChnls.push(aBuffer.getChannelData(btwIndex));

  while (btwPos < btwLength) {
    for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
      // interleave btwChnls
      btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
      btwSample =
        (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
      btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
      btwPos += 2;
    }
    btwOffset++; // next source sample
  }
  console.log('OVERFLOW', btwArrBuff);
  // let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));
  // let wavSamples = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);

  //  wavToMp3(wavHdr.channels, wavHdr.sampleRate, wavSamples);
  return btwArrBuff;
  function setUint16(data) {
    btwView.setUint16(btwPos, data, true);
    btwPos += 2;
  }

  function setUint32(data) {
    btwView.setUint32(btwPos, data, true);
    btwPos += 4;
  }
}
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
