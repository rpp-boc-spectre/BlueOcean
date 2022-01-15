import React from 'react';

import TimeControlButton from './TimeControlButton.jsx';

import { Box, Typography } from '@mui/material';

/* temp example array of available time control buttons and their handlers.
   actual buttons and functionality are still WIP, and they definitely
   would not be stored like this in the finished build.  */
const handleStop = () => {
  console.log('CLICKED STOP BUTTON')
};
const handlePlay = () => {
  console.log('CLICKED PLAY BUTTON')
};
const handlePause = () => {
  console.log('CLICKED PAUSE BUTTON')
};
const handleRecord = () => {
  console.log('CLICKED RECORD BUTTON')
};
const handleBeginning = () => {
  console.log('CLICKED BACK TO BEGINNING BUTTON')
};
const handleRewind = () => {
  console.log('CLICKED REWIND BUTTON')
};
const handleEnd = () => {
  console.log('CLICKED SKIP TO END BUTTON')
};
const handleFastForward = () => {
  console.log('CLICKED FAST FORWARD BUTTON')
};


const TimeControlBox = (props) => {

  const buttons = [
    {name: 'Play', handler: props.playAllHandler},
    {name: 'Pause', handler: props.pauseResumeHandler},
    {name: 'Stop', handler: props.stopAllHandler},
    {name: 'Edit', handler: props.editorOpenHandler}
  ];
  return (
    <>
      <Box
        sx={{
          m: 'auto',
          display: 'grid',
          gridTemplateColumns: {xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr'},
          gridTemplateRows: {xs: '1fr 1fr'},
          gap: 1
        }}
      >
        {buttons.map((button, index) => {
          return <TimeControlButton isPlaying={props.isPlaying} key={index} button={button} />
        })}
      </Box>
    </>
  );
};

export default TimeControlBox;