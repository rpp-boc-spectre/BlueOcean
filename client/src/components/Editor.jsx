import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import LayerPlayer from "./LayerPlayer";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import ImportAduio from "./ImportAudio";
import Recorder from './Recorder'

import { getTrackData } from "../utils/database";
import { getTrackUrls  } from "../utils/storage";

export default function Editor() {

  const [importModalState, setImportModalState ] = useState();
  const [recordingModalState, setRecordingModalState] = useState();
  const [audioLayers, setAudioLayers] = useState([])
  const [trackId, setTrackId] = useState('UtEWidzvugKK1I6CRFVU')

  const handleImportClose = () => {
    setImportModalState(false)
  }

  const handleRecorderClose = () => {
    setRecordingModalState(false)
  }

  useEffect(() => {
    getTrackData(trackId)
      .then(data => {
        return getTrackUrls(data)
      })
      .then(trackWithUrls => {
        let layers =[]
        for (var layer in trackWithUrls.layers) {
          layers.push(trackWithUrls.layers[layer])
        }
        setAudioLayers(layers)
      })
  }, [])

  return (
    <>
      <Typography variant="h3">Editor Component</Typography>
      <Button variant="outlined" onClick={() => {setImportModalState(true)}}>Import Audio Layers</Button>
      <Button variant="outlined" onClick={() => {setRecordingModalState(true)}}>Record New Layer</Button>
      <LayerPlayer layers={audioLayers}/>
      <Modal open={importModalState} onClose={handleImportClose}>
        <Box sx={{ width: 500, height: 300, backgroundColor: 'white'}}>
          <ImportAduio userId={'gqEkSDrIsMhrP9HJIjqg7VcMpQ93'} currentList={audioLayers} setParentLayers={setAudioLayers} close={handleImportClose}/>
        </Box>
      </Modal>
      <Modal open={recordingModalState} onClose={handleRecorderClose} >
        <Box sx={{ backgroundColor: 'white', margin: 'auto' }}>
          <Recorder currentList={audioLayers} setAudioLayers={setAudioLayers}/>
        </Box>
      </Modal>
    </>
  )
}