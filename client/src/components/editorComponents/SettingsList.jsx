import React from 'react';

import { Box, Button, Drawer, Typography } from '@mui/material';

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



const SettingsList = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const container = window !== undefined ? () => window().document.body : undefined;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Button onClick={handleDrawerToggle} sx={{
        display: {xs: 'block', md: 'none'},
        border: 1,
        gridColumn: {xs: '3', md: '3'},
        gridRow: {xs: '4', md: '2 / 4'}
      }}>
        <Typography>Settings</Typography>
      </Button>
      <Drawer  container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: {xs: 'block', md: 'none'},
            border: 1,
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%', maxHeight: '80%' }
          }}>
        <Typography variant='subtitle1'>Settings List</Typography>
        {settingsArray.map((setting, index) => {
          return (<Button variant='outlined' key={index} onClick={setting.handler}>{setting.name}</Button>);
        })}
      </Drawer>
      <Box
      sx={{
        display: {xs: 'none', md: 'block'},
        border: 1,
        gridColumn: {xs: '3', md: '3'},
        gridRow: {xs: '4', md: '2 / 4'}
      }}>
        {settingsArray.map((setting, index) => {
          return (<Button variant='outlined' key={index} onClick={setting.handler}>{setting.name}</Button>);
        })}
      </Box>
    </>
  );
};

export default SettingsList;