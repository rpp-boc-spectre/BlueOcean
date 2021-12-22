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

const icons = {
  'Stop': StopIcon,
  'Play': PlayArrowIcon,
  'Pause': PauseIcon,
  'Reocrd': FiberManualRecordIcon,
  'Beginning': FirstPageIcon,
  'Rewind': FastRewindIcon,
  'FastForward': FastForwardIcon,
  'End': LastPageIcon
};

const TimeControlButton = (props) => {
  const icon = icons[props.button.name];
  console.log('ICON', icon)
  return (
    <>
      <Button variant='outlined'><svg data-testid={icon}></svg></Button>
    </>
  );
};

export default TimeControlButton;