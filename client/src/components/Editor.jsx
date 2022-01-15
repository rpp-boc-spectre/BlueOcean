import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';

import { Alert, Box, Container, Modal, Drawer, Divider } from '@mui/material'
import IconButton from "@mui/material/IconButton";
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowBack from '@mui/icons-material/ArrowBack';

import toast from 'react-hot-toast';

import LayerPlayer from "./LayerPlayer";
import ImportAudio from "./ImportAudio";
import Recorder from './Recorder';

import { getTrackData } from "../utils/database";
import { getTrackUrls } from "../utils/storage";
import { Player } from '../lib/player';
import UserContext from "../context/UserContext";
import UploadFile from "./UploadFile.jsx";

import { setPlayer } from '../lib/layerTableReducer.js';
import { useLayerStore } from '../context/LayerContext.js'

export default function Editor() {
  const [layerStore, dispatch] = useLayerStore();
  const [importModalState, setImportModalState] = useState(false);
  const [recordingModalState, setRecordingModalState] = useState(false);
  const [uploadModalState, setUploadModalState] = useState(false);
  const [audioLayers, setAudioLayers] = useState([]);
  const [originalAudioLayers, setOriginalAudioLayers] = useState([]);
  const [trackMetadata, setTrackMetadata] = useState({});
  const [trackData, setTrackData] = useState(null)
  const userData = useContext(UserContext);
  const { trackId } = useParams();
  const playerRef = useRef();

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
          if (data && data.meta) {
            setTrackMetadata(data.meta);
          }
          data.id = trackId
          return getTrackUrls(data)
        })
        .then(trackWithUrls => {
          let layers = []
          for (var layer in trackWithUrls.layers) {
            layers.push(trackWithUrls.layers[layer])
          }
          setTrackData(trackWithUrls)
          setAudioLayers(layers)
          setOriginalAudioLayers(layers)
        })
        .catch(error => {
          toast.custom(<Alert variant="filled" severity="error">There was an error getting your track</Alert>)
        })
    }

    if (trackId === undefined) {
      setTrackMetadata({})
      if (audioLayers?.length > 0) {
        setAudioLayers([])
      }
      if (layerStore.player) {
        // kill the old players audio
        layerStore.player.dispose()
        // make a new blank player
        const newPlayer = new Player();
        dispatch(setPlayer(newPlayer))

      }
    }
  }, [trackId])

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
    <Container sx={{
      minHeight: { xs: '90vh', md: '90vh' },
      display: 'grid',
      gridTemplateRows: { xs: '5fr 1fr', md: '6fr 1fr' },
      mx:'auto',
      my:'10px',
      p: {xs: '10px', md: '15px'},
      width: {xs: '100', md: '70vw'},
      maxWidth: '1000px',
      maxHeight: {xs: '84vh', md:'87vh'},
      bgcolor: 'primary.light',
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
          display: 'none'
      },
      borderRadius: {xs: '0', md: '5%'}
    }}>
      <LayerPlayer
        layers={audioLayers}
        userId={userData?.user?.uid}
        trackId={trackId}
        trackMetadata={trackMetadata}
        recordingHandler={recordingHandler}
        importHandler={importHandler}
        updateMetadata={setTrackMetadata}
        uploadHandler={uploadHandler}
        trackData={trackData}
      />
      <Drawer open={importModalState}>
        <ImportAudio
          userId={userData?.user?.uid}
          originalList={originalAudioLayers}
          currentList={audioLayers}
          setParentLayers={setAudioLayers}
          close={handleImportClose}
        />
        <IconButton onClick={handleImportClose}>
          <ArrowBack />
        </IconButton>
      </Drawer>
      <Drawer
        sx={{
          width: { xs: '65%', sm: '75%', md: '500px' },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: { xs: '65%', sm: '75%', md: '500px' },
            boxSizing: 'border-box',
            mx: "auto"
          },
          mx: "auto"
        }}
        variant="persistent"
        anchor="bottom"
        open={recordingModalState}
      >
        <IconButton onClick={handleRecorderClose}>
          <ArrowDownward />
        </IconButton>
        <Divider />
        <Recorder currentList={audioLayers} setAudioLayers={setAudioLayers} />
      </Drawer>

      <Drawer
        sx={{
          width: { xs: '65%', sm: '75%', md: '500px' },
          height: { xs: '15vh', sm: '21vh', md: '25vh' },
          // flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: { xs: '65%', sm: '75%', md: '500px' },
            height: { xs: '20vh', sm: '23vh', md: '27vh' },
            boxSizing: 'border-box',
            mx: "auto"
          },
          mx: "auto",
        }}
        variant="persistent"
        anchor="bottom"
        open={uploadModalState}
      >
        <IconButton onClick={handleUploadClose}>
          <ArrowDownward />
        </IconButton>
        <UploadFile />
      </Drawer>
      {/* <Modal open={uploadModalState} onClose={handleUploadClose}>
        <Box
          sx={{
            backgroundColor: 'secondary.light',
            mx: 'auto',
            my: 'auto',
            width: { xs: '85%', sm: '85%', md: '75%' },
            height: { xs: '15vh', sm: '17vh', md: '20vh' }
          }}
        >
          <UploadFile />
        </Box>
      </Modal> */}
    </Container>
  )
}
