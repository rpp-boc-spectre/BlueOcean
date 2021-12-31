import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import LayerPlayer from "./LayerPlayer";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import ImportAduio from "./ImportAudio";

export default function Editor() {

  const [importModalState, setImportModalState ] = useState();
  const [audioLayers, setAudioLayers] = useState([])

  const handleClose = () => {
    setImportModalState(false)
  }

  return (
    <>
      <Typography variant="h3">Editor Component</Typography>
      <Button variant="outlined" onClick={() => {setImportModalState(true)}}>Import Audio Layers</Button>
      <LayerPlayer />
      <Modal open={importModalState} onClose={handleClose}>
        <Box sx={{ width: 500, height: 300, backgroundColor: 'white'}}>
          <ImportAduio userId={'gqEkSDrIsMhrP9HJIjqg7VcMpQ93'} currentList={audioLayers} setParentLayers={setAudioLayers} close={handleClose}/>
        </Box>
      </Modal>
    </>
  )
}