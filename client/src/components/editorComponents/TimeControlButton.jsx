import React from 'react';

import { Button } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';


/* attempted to use an object and have the code look up each button name and
   pick the right icon, but it wasn't working. so I just brute forced it, sorry */
const TimeControlButton = (props) => {
  const target = props.button.name;
  let button;
  if (target === 'Stop') {
    button = <Button variant='outlined' onClick={props.button.handler}><StopIcon /></Button>
  }
  if (target === 'Play') {
    button = <Button variant='outlined' onClick={props.button.handler}><PlayArrowIcon /></Button>
  }
  if (target === 'Pause') {
    button = <Button variant='outlined' onClick={props.button.handler}><PauseIcon /></Button>
  }
  if (target === 'Record') {
    button = <Button variant='outlined' onClick={props.button.handler}><FiberManualRecordIcon /></Button>
  }
  if (target === 'Beginning') {
    button = <Button variant='outlined' onClick={props.button.handler}><FirstPageIcon /></Button>
  }
  if (target === 'Rewind') {
    button = <Button variant='outlined' onClick={props.button.handler}><FastRewindIcon /></Button>
  }
  if (target === 'End') {
    button = <Button variant='outlined' onClick={props.button.handler}><LastPageIcon /></Button>
  }
  if (target === 'FastForward') {
    button = <Button variant='outlined' onClick={props.button.handler}><FastForwardIcon /></Button>
  }
  return (
    <>
      {button}
    </>
  );
};

export default TimeControlButton;