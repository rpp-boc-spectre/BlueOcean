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

const FileControlButton = (props) => {
  const target = props.button.name;
  let button;
  const targets = {
    'Record': (<FiberManualRecordIcon />),
    'Import': (<ImportExportIcon />),
    'Upload': (<UploadFileIcon />)
  }

  return (<Button
    color='info'
    variant='outlined'
    onClick={props.button.handler}
  >
    {targets[target]}
  </Button>);
};

export default FileControlButton;