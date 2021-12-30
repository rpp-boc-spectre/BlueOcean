import React, { useEffect, useState } from "react";
import * as Tone from 'tone'
import axios from 'axios'
// import Visualizer from './Visualizer.jsx';

export default function MusicPlayer() {

  const [urls, setUrls] = useState(null)
  const [ready, setReady] = useState(false)

  const getUrls = async () => {
    try {
      let response = await axios.get('/audio')
      setUrls(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlayClick = async () => {
    await Tone.start()
    Tone.Transport.start()
    renderWaveform();
  }

  const handleStopClick = () => {
    Tone.Transport.pause()
  }

  const renderWaveform = () => {
    if (urls.length > 0) {
      let files = {};
      let audioCtx = {};
      let sources = {};
      let analysers = {};
      let bufferLengths = {};
      let dataArrays = {};
      let averageBL, barWidth, barHeight, x;
      const canvas = document.querySelector('.visualizer');
      const canvasCtx = canvas.getContext('2d');

      for (let i = 0; i < urls.length; i++) {
        files[i] = document.createElement('audio');
        files[i].setAttribute('src', urls[i]);
        audioCtx[i] = new (window.AudioContext || window.webkitAudioContext)();
        // CREATE CONTEXT WRAPPER WITH TONE.CONTEXT()
      }

      for (let audio in audioCtx) {
        // USE TONE.CONTEXT.createAnalyser()
        analysers[audio] = audioCtx[audio].createAnalyser();
        // USE Tone.Context.createMediaElementSource()
        sources[audio] = audioCtx[audio].createMediaElementSource(files[audio]);
        sources[audio].connect(analysers[audio]);
        analysers[audio].connect(audioCtx[audio].destination);
      }

      for (let audio in analysers) {
        analysers[audio].fftSize = 2048;
        bufferLengths[audio] = analysers[audio].frequencyBinCount;
        dataArrays[audio] = new Uint8Array(bufferLengths[audio]);
        analysers[audio].getByteTimeDomainData(dataArrays[audio]);
      }

      averageBL = (Object.values(bufferLengths).reduce((a, b) => a + b)) / Object.keys(bufferLengths).length;
      barWidth = canvas.width/averageBL;
      x = 0;
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const draw = () => {
        for (let audio in analysers) {
          analysers[audio].getByteTimeDomainData(dataArrays[audio]);
        }

        canvasCtx.fillStyle = '#FFE4C4';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = '#000000';
        canvasCtx.beginPath();

        let sliceWidth = canvas.width * 1.0 / averageBL;
        let x = 0;
        let avg = 0;

        for (let i = 0; i < averageBL; i++) {
          for (let arr in dataArrays) {
            let currentArr = dataArrays[arr];
            avg += currentArr[i];
          }
          avg = avg / Object.keys(dataArrays).length;
          let v = avg/128.0;
          let y = v + (canvas.height/2);

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
        window.requestAnimationFrame(draw);
      };
      draw();
    }
  }

  useEffect(() => {
    getUrls()
  }, [])

  useEffect(() => {
    if (urls) {
      urls.forEach((url, index) => {
        let player = new Tone.Player({
          url: url
        }).toDestination()
        player.sync().start(0)
      })
      Tone.loaded().then(() => {
        console.log('Ready to play')
        setReady(true)

      })
    }

  }, [urls])

  return (
    <div>
      {/* <Visualizer urls={urls} play={handlePlayClick} /> */}
      <canvas className='visualizer' width='1000' height='300' />
      <h3>Music Player</h3>
      {
        ready ?
          <>
            <button onClick={handlePlayClick}>Start All</button>
            <button onClick={handleStopClick}>Pause All</button>
          </>
          :
          <p>loading...</p>
      }
    </div>
  )
}