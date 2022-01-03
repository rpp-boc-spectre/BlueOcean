import React, { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Modal from "@mui/material/Modal";
import { useSnackbar } from "material-ui-snackbar-provider";

import LayerPlayer from "./LayerPlayer";
import ImportAduio from "./ImportAudio";
import Recorder from './Recorder';

import { getTrackData } from "../utils/database";
import { getTrackUrls } from "../utils/storage";
import UserContext from "../context/UserContext";

export default function Editor() {

  const [importModalState, setImportModalState] = useState(false);
  const [recordingModalState, setRecordingModalState] = useState(false);
  const [audioLayers, setAudioLayers] = useState([])
  const userData = useContext(UserContext);
  const snackbar = useSnackbar();
  const { trackId } = useParams();

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
        let layers = []
        for (var layer in trackWithUrls.layers) {
          layers.push(trackWithUrls.layers[layer])
        }
        setAudioLayers(layers)
      })
      .catch(error => {
        snackbar.showMessage(<Alert variant='error'>There was an error getting your track</Alert>)
      })
  }, [])

  const importHandler = () => {
    setImportModalState(true);
  };
  const recordingHandler = () => {
    setRecordingModalState(true);
  };

  return (
    <>
      <Container sx={{
        border: 1,
        maxHeight: '90vh',
        minHeight: { xs: '100%', md: '70%' },
        width: { xs: '100%', md: '70%' },
        display: 'grid',
        gridTemplateColumns: { xs: '3fr 2fr', md: '1fr 6fr' },
        gridTemplateRows: { xs: '5fr 1fr', md: '6fr 1fr' }
      }}>

        <LayerPlayer layers={audioLayers} userId={userData?.user?.uid} trackId={trackId} recordingHandler={recordingHandler} importHandler={importHandler} />

        <Modal open={importModalState} onClose={handleImportClose}>
          <Box sx={{ backgroundColor: 'white', top: 50, maxHeight: '100vh', overflow: 'auto' }}>
            <ImportAduio userId={userData?.user?.uid} currentList={audioLayers} setParentLayers={setAudioLayers} close={handleImportClose} />
          </Box>
        </Modal>
        <Modal open={recordingModalState} onClose={handleRecorderClose} >
          <Box sx={{ backgroundColor: 'white', margin: 'auto', top: 50, }}>
            <Recorder currentList={audioLayers} setAudioLayers={setAudioLayers} />
          </Box>
        </Modal>
      </Container>
    </>
  )
}

/* <Button variant="outlined" onClick={() => {setRecordingModalState(true)}}>Record New Layer</Button> */
/* <Button variant="outlined" onClick={() => {setImportModalState(true)}}>Import Audio Layers</Button> */