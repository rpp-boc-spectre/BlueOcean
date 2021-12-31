import React, { useEffect, useState } from "react";
import * as Tone from 'tone'
import axios from 'axios'

export default function MusicPlayer() {

  const [urls, setUrls] = useState(null)
  const [ready, setReady] = useState(false)
  const [players, setPlayers] = useState({})

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
    Tone.Transport.schedule((time) => {
      Tone.Draw.schedule(() => {
        // console.log('TONE DRAW TIME', time);
        renderWaveform(players);
      }, time);
    }, "+0.005");
    Tone.Transport.start()

  }

  const handleStopClick = () => {
    Tone.Transport.pause()
  }

  const renderWaveform = (players) => {
    if (urls.length > 0) {
      let analysers = {};
      let bufferLengths = {};
      let dataArrays = {};
      let averageBL;
      const canvas = document.querySelector('.visualizer');
      const canvasCtx = canvas.getContext('2d');

      for (let waveform in players) {
        analysers[waveform] = players[waveform]._analyser._analysers[0];
      }

      for (let audio in analysers) {
        analysers[audio].fftSize = 2048;
        bufferLengths[audio] = analysers[audio].frequencyBinCount;
        dataArrays[audio] = new Uint8Array(bufferLengths[audio]);
      }

      averageBL = (Object.values(bufferLengths).reduce((a, b) => a + b)) / Object.keys(bufferLengths).length;
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
        const length = Object.keys(dataArrays).length;

        for (let i = 0; i < averageBL; i++) {
          let counter = 0;
          let avgDA = 0;
          let v, y, average;
          for (let arr in dataArrays) {
            let currentArr = dataArrays[arr];
            avgDA += currentArr[i];
            counter++;
            if (counter === length) {
              average = avgDA / length;
              v = average/128.0;
              y = v * canvas.height/2;
              counter = 0;
              average = 0;
              if (i === 0) {
                canvasCtx.moveTo(x, y);
              } else {
                canvasCtx.lineTo(x, y);
              }
              x += sliceWidth;
            }
          }
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
    let playersObj = {};
    if (urls) {
      urls.forEach((url, index) => {
        let player = new Tone.Player({
          url: url
        }).toDestination()
        const toneWaveform = new Tone.Waveform();
        player.connect(toneWaveform)
        playersObj[index] = toneWaveform;
        player.sync().start(0)
      })
      Tone.loaded().then(() => {
        console.log('Ready to play')
        setReady(true)
        setPlayers(playersObj);
      })
    }

  }, [urls])

  return (
    <div>
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