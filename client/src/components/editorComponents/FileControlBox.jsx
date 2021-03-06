import React from 'react';

import FileControlButton from './FileControlButton.jsx';
import SettingsList from './SettingsList.jsx';

import { Box, Typography } from '@mui/material';

const FileControlBox = (props) => {

  const buttons = [
    {name: 'Record', handler: props.recordingHandler},
    {name: 'Import', handler: props.importHandler},
    {name: 'Upload', handler: props.uploadHandler},
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
          return <FileControlButton isPlaying={props.isPlaying} key={index} button={button} />
        })}
        <SettingsList
          isPlaying={props.isPlaying}
          saveHandler={props.saveHandler}
          metadata={props.metadata}
          updateMetadata={props.updateMetadata}
        />
      </Box>
    </>
  );
};

export default FileControlBox;