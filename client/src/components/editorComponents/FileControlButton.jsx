import React from 'react';

import { Button } from '@mui/material';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const FileControlButton = (props) => {
  const target = props.button.name;
  let button;
  const targets = {
    'Record': (<FiberManualRecordIcon />),
    'Import': (<ImportExportIcon />),
    'Upload': (<UploadFileIcon />)
  }

  return (<Button
    color='black'
    variant='outlined'
    onClick={props.button.handler}
    disabled={props.isPlaying}
  >
    {targets[target]}
  </Button>);
};

export default FileControlButton;