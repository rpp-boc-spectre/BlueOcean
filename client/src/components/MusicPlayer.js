import React, { useEffect, useState } from "react";
import * as Tone from 'tone'
import axios from 'axios'

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
    // let elements = document.getElementsByClassName('mp3')
    // for (var element of elements) {
    //   element.play()
    // }
    await Tone.start()
    Tone.Transport.start()
  }

  const handleStopClick = () => {
    // let elements = document.getElementsByClassName('mp3')
    // for (var element of elements) {
    //   element.pause()
    // }
    Tone.Transport.pause()
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