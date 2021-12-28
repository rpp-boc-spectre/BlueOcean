import React, { useEffect, useState } from "react";
import * as Tone from 'tone'
import axios from 'axios'
import testMp3 from '../testing.mp3'
export default function MusicPlayer() {

  const [urls, setUrls] = useState(true)
  const [ready, setReady] = useState(false)

  const getUrls = async () => {
    try {
      let response = await axios.get('/audio')
      setUrls([response.data[0],response.data[2]])
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlayClick = async () => {
    await Tone.start()
    Tone.Transport.start()
  }

  const handleStopClick = () => {
    Tone.Transport.pause()
  }

  // useEffect(() => {
  //   getUrls()
  // }, [])

  useEffect(() => {
    if (urls) {
      const urls = [testMp3]
      console.log('urls',urls)
      const test = urls.forEach((url, index) => {
        console.log('url',url)
        let player = new Tone.Player({
          url: url
        }).toDestination()
        // Tone.Transport.bpm.rampTo(200,10)
        // const gain = new Tone.Gain(-20,'decibels')
        // player.connect(gain).toDestination()
        // const comp = new Tone.Compressor(-3, 18).toDestination();
        // player.connect(comp)
        const pitchShift = new Tone.PitchShift(4).toDestination()
        const pitchShift2 = new Tone.PitchShift(7).toDestination()
        player.connect(pitchShift2)
        player.connect(pitchShift)
        console.log('test',test)
        player.sync().start()
      })

      Tone.loaded().then(() => {
        console.log('Ready to play')
        setReady(true)

      })
    }

  }, [urls])

  return (
    <div>
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