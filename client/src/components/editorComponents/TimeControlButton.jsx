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

const TimeControlButton = (props) => {
  const target = props.button.name;
  let button;
  const regularButtons = {
    'Stop': (<StopIcon />),
    'Play': (<PlayArrowIcon />),
    'Pause': (<PauseIcon />),
    'Beginning': (<FirstPageIcon />),
    'Rewind': (<FastRewindIcon />),
    'End': (<LastPageIcon />),
    'FastForward': (<FastForwardIcon />),
    'Edit': (<EditIcon />),
    'Delete': (<DeleteIcon />),
  };

  const irregularButtons = {
    'Mute': props.button.value ? (<VolumeOffIcon />) : (<VolumeUpIcon />),
    'Solo': props.button.value ? (SoloFilledIcon) : (SoloIcon)
  }

  const checkDisable = (target) => {
    if (target === "Edit") {
      // Editor button is never disabled
      return false;
    }
    if (target === "Play") {
      // Play disabled if playing
      return props.isPlaying;
    }
    // Pause & Stop disabled if not playing
    return !props.isPlaying;
  }

  if (Object.keys(regularButtons).includes(target)) {
    button = <Button
      color="black"
      variant='outlined'
      onClick={props.button.handler}
      sx={{ ...props.sx, maxHeight: '100px' }}
      disabled={checkDisable(target)}
    >
      {regularButtons[target]}
    </Button>
  }

  if (Object.keys(irregularButtons).includes(target)) {
    button = <ToggleButton
      color='black'
      variant='outlined'
      onClick={props.button.handler}
      value={props.button.value}
      sx={{ ...props.sx, maxHeight: '100px' }}
    >
      {irregularButtons[target]}
    </ToggleButton>
  }

  return button;
};

export default TimeControlButton;