import React, { useEffect, useState } from "react";
import axios from 'axios'

export default function MusicPlayer() {

  const [urls, setUrls] = useState(null)

  const getUrls = async () => {
    try {
      let response = await axios.get('/audio')
      setUrls(response.data)
    } catch(error) {
      console.log(error)
    }
  }

  const handlePlayClick = () => {
    let elements = document.getElementsByClassName('mp3')
    for (var element of elements) {
      element.play()
    }
  }

  const handleStopClick = () => {
    let elements = document.getElementsByClassName('mp3')
    for (var element of elements) {
      element.pause()
    }
  }

  useEffect(() => {
    getUrls()
  }, [])

  return (
    <div>
      <h3>Music Player</h3>
      {
        urls ?
        <>
        {urls.map((url) => {
          return (
            <audio controls className={'mp3'} >
              <source src={url} type="audio/mp3"></source>
            </audio>
          )
        })}
        <button onClick={handlePlayClick}>Start All</button>
        <button onClick={handleStopClick}>Pause All</button>
        </>
        :
        null
      }
    </div>
  )
}