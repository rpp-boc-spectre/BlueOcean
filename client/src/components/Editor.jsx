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
import UploadFile from "./UploadFile.jsx";

import { LayerStoreProvider } from "../context/LayerContext.js";
import { initialState, layerTableReducer } from "../lib/layerTableReducer.js";

export default function Editor() {

  const [importModalState, setImportModalState] = useState(false);
  const [recordingModalState, setRecordingModalState] = useState(false);
  const [uploadModalState, setUploadModalState] = useState(false);
  const [audioLayers, setAudioLayers] = useState([]);
  const [trackMetadata, setTrackMetadata] = useState({
    trackName: "",
    tag: "",
    public: false
  });
  const userData = useContext(UserContext);
  const snackbar = useSnackbar();
  const { trackId } = useParams();

  const handleImportClose = () => {
    setImportModalState(false)
  }

  const handleRecorderClose = () => {
    setRecordingModalState(false)
  }

  const handleUploadClose = () => {
    setUploadModalState(false)
  }

  useEffect(() => {
    if (trackId) { // if trackID is undefined, this will just open a blank editor (for a new track)
      getTrackData(trackId)
        .then(data => {
          console.log('Track Data', data)
          if (data && data.metadata) {
            // trackMetadata = data.metadata;
            setTrackMetadata(data.metadata);
          }
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
          console.log(error);
          snackbar.showMessage(<Alert variant='error'>There was an error getting your track</Alert>)
        })
    }
  }, [])

  const importHandler = () => {
    setImportModalState(true);
  };
  const recordingHandler = () => {
    setRecordingModalState(true);
  };
  const uploadHandler = () => {
    console.log('click')
    setUploadModalState(true)
  };

  return (

    <LayerStoreProvider initialState={initialState} reducer={layerTableReducer}>
      <Container sx={{
        border: 1,
        maxHeight: '90vh',
        minHeight: { xs: '100%', md: '70%' },
        width: { xs: '100%', md: '70%' },
        display: 'grid',
        gridTemplateColumns: { xs: '3fr 2fr', md: '1fr 6fr' },
        gridTemplateRows: { xs: '5fr 1fr', md: '6fr 1fr' }
      }}>

        <LayerPlayer
          layers={audioLayers}
          userId={userData?.user?.uid}
          trackId={trackId}
          trackMetadata={trackMetadata}
          recordingHandler={recordingHandler}
          importHandler={importHandler}
          uploadHandler={uploadHandler}
        />

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
        <Modal open={uploadModalState} onClose={handleUploadClose} >
          <Box sx={{ backgroundColor: 'white', margin: 'auto', top: 50, }}>
            <UploadFile />
          </Box>
        </Modal>
      </Container>
    </LayerStoreProvider>
  )
}

/* <Button variant="outlined" onClick={() => {setRecordingModalState(true)}}>Record New Layer</Button> */
/* <Button variant="outlined" onClick={() => {setImportModalState(true)}}>Import Audio Layers</Button> */