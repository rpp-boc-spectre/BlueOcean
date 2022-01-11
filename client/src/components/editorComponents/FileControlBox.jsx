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
      <Box sx={{
        border: 1,
        gridColumn: {xs: '1', md: '1'},
        gridRow: {xs: '2', md: '2'}
      }}>
        {buttons.map((button, index) => {
          return <FileControlButton key={index} button={button} />
        })}
        <SettingsList
          saveHandler={props.saveHandler}
          metadata={props.metadata}
          updateMetadata={props.updateMetadata}
        />
      </Box>
    </>
  );
};

export default FileControlBox;