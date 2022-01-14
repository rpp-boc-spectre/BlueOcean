import React from 'react';

import { Button, ToggleButton } from '@mui/material';

import StopIcon from '@mui/icons-material/Stop';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// import SvgIcon from '@mui/material/SvgIcon';
import SoloSVG from './S.svg';
import SoloFilledSVG from './S-Filled.svg';

const SoloIcon = <img src={SoloSVG} height='24' width='24' />;
const SoloFilledIcon = <img src={SoloFilledSVG} height='24' width='24' />;

/* attempted to use an object and have the code look up each button name and
   pick the right icon, but it wasn't working. so I just brute forced it, sorry */
const TimeControlButton = (props) => {
  const target = props.button.name;
  let button;
  const regularButtons = {
    'Stop': (<StopIcon />),
    'Play': (<PlayArrowIcon />),
    'Pause': (<PauseIcon />),
    'Record': (<FiberManualRecordIcon />),
    'Beginning': (<FirstPageIcon />),
    'Rewind': (<FastRewindIcon />),
    'End': (<LastPageIcon />),
    'FastForward': (<FastForwardIcon />),
    'Edit': (<EditIcon />),
    'Delete': (<DeleteIcon />),
    'Import': (<ImportExportIcon />),
    'Upload': (<UploadFileIcon />)
  };

  const irregularButtons = {
    'Mute': props.button.value ? (<VolumeOffIcon />) : (<VolumeUpIcon />),
    'Solo': props.button.value ? (SoloFilledIcon) : (SoloIcon)
  }

  if (Object.keys(regularButtons).includes(target)) {
    button = <Button
      variant='outlined'
      onClick={props.button.handler}
      sx={{ mb: 2 }}
    >
      {regularButtons[target]}
    </Button>
  }

  if (Object.keys(irregularButtons).includes(target)) {
    button = <ToggleButton
      color='primary'
      onClick={props.button.handler}
      value={props.button.value}
      sx={{ mb: 2 }}
    >
      {irregularButtons[target]}
    </ToggleButton>
  }

  return button;
};

export default TimeControlButton;