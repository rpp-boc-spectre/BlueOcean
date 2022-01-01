import React, { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import Typography from "@mui/material/Typography";
import LayerPlayer from "./LayerPlayer";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import ImportAduio from "./ImportAudio";
import Recorder from './Recorder'
import { useSnackbar } from "material-ui-snackbar-provider";

import { getTrackData } from "../utils/database";
import { getTrackUrls  } from "../utils/storage";

export default function Editor() {

  const [importModalState, setImportModalState ] = useState(false);
  const [recordingModalState, setRecordingModalState] = useState(false);
  const [audioLayers, setAudioLayers] = useState([])
  const [trackId, setTrackId] = useState('ArtNIYCmtxFDhi5Dnyp9')
  const snackbar = useSnackbar();
  // const [trackId, setTrackId] = useState(null)

  const handleImportClose = () => {
    setImportModalState(false)
  }

  const handleRecorderClose = () => {
    setRecordingModalState(false)
  }

  useEffect(() => {
    getTrackData(trackId)
      .then(data => {
        console.log('Track Data', data)
        return getTrackUrls(data)
      })
      .then(trackWithUrls => {
        console.log('', trackWithUrls)
        let layers =[]
        for (var layer in trackWithUrls.layers) {
          layers.push(trackWithUrls.layers[layer])
        }
        setAudioLayers(layers)
      })
      .catch(error => {
        snackbar.showMessage(<Alert variant='error'>There was an error getting your track</Alert>)
      })
  }, [])

  return (
    <>
      <Typography variant="h3">Editor Component</Typography>
      <Button variant="outlined" onClick={() => {setImportModalState(true)}}>Import Audio Layers</Button>
      <Button variant="outlined" onClick={() => {setRecordingModalState(true)}}>Record New Layer</Button>
      <LayerPlayer layers={audioLayers} userId={'gqEkSDrIsMhrP9HJIjqg7VcMpQ93'} trackId={trackId}/>
      <Modal open={importModalState} onClose={handleImportClose}>
        <Box sx={{ backgroundColor: 'white', top: 50}}>
          <ImportAduio userId={'gqEkSDrIsMhrP9HJIjqg7VcMpQ93'} currentList={audioLayers} setParentLayers={setAudioLayers} close={handleImportClose}/>
        </Box>
      </Modal>
      <Modal open={recordingModalState} onClose={handleRecorderClose} >
        <Box sx={{ backgroundColor: 'white', margin: 'auto', top: 50,  }}>
          <Recorder currentList={audioLayers} setAudioLayers={setAudioLayers}/>
        </Box>
      </Modal>
    </>
  )
}