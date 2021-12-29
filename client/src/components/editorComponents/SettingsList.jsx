import React from 'react';
import SettingsButton from './SettingsButton.jsx';

import { Box, Typography } from '@mui/material';

/*
Actual settings and their respective functions subject to change, and their
handlers might need to be moved to the Editor component to properly interact with
everything else and be passed down as props, but for now, they live here
*/

const saveHandler = () => {
  console.log('CLICKED SAVE');
}
const newLayerHandler = () => {
  console.log('CLICKED NEW LAYER');
}
const newAudioHandler = () => {
  console.log('CLICKED NEW AUDIO');
}
const uploadHandler = () => {
  console.log('CLICKED UPLOAD');
}

const settingsArray = [
  {name: 'Save', handler: saveHandler},
  {name: 'New Layer', handler: newLayerHandler},
  {name: 'New Audio', handler: newAudioHandler},
  {name: 'Upload', handler: uploadHandler}
];

const SettingsList = () => {
  return (
    <>
      <Box sx={{ border: 1}}>
        <Typography variant='subtitle1'>Settings List</Typography>
        {settingsArray.map((setting, index) => {
          return (<SettingsButton key={index} setting={setting} />);
        })}
      </Box>
    </>
  );
};

export default SettingsList;