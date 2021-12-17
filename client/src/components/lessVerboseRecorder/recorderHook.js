import { useEffect, useState } from 'react';

const RecordState = () => {
  const [audioURL, setAudioURL] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    if (!recorder) {
      if (isRecording) {
        getRecorder().then(setRecorder, console.error);
      }
      return;
    }

    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }

    const handleData = (e) => {
      setAudioURL((prevUrls)=>[...prevUrls,URL.createObjectURL(e.data)]);
    };

    recorder.addEventListener('dataavailable', handleData);
    return () => recorder.removeEventListener('dataavailable', handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return [audioURL,isRecording,startRecording,stopRecording]
};

const getRecorder = async  function (){
    const stream = await navigator.mediaDevices.getUserMedia({audio:true})
    return new MediaRecorder(stream)
}

export default RecordState