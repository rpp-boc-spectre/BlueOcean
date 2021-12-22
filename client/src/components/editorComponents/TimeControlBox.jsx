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

const buttons = [
  {name: 'Stop', handler: handleStop},
  {name: 'Play', handler: handlePlay},
  {name: 'Pause', handler: handlePause},
  {name: 'Record', handler: handleRecord},
  {name: 'Beginning', handler: handleBeginning},
  {name: 'Rewind', handler: handleRewind},
  {name: 'FastForward', handler: handleFastForward},
  {name: 'End', handler: handleEnd}
];

const TimeControlBox = () => {
  return (
    <>
      <Box sx={{ border: 1}}>
        {buttons.map((button, index) => {
          return <TimeControlButton key={index} button={button} />
        })}
      </Box>
    </>
  );
};

export default TimeControlBox;