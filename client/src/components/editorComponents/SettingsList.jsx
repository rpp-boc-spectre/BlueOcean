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




const SettingsList = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const container = window !== undefined ? () => window().document.body : undefined;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const settingsArray = [
    { name: 'Save', handler: props.saveHandler },
    { name: 'New Layer', handler: props.importHandler },
    { name: 'New Audio', handler: newAudioHandler },
    { name: 'Upload', handler: props.uploadHandler }
  ];

  return (
    <>
      <Button onClick={handleDrawerToggle} sx={{
        border: 1,
        gridColumn: { xs: '2', md: '1' },
        gridRow: { xs: '2', md: '1' }
      }}>
        <Typography>Settings</Typography>
      </Button>
      <Drawer container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          border: 1,
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%', maxHeight: '80%' }
        }}>
        <Typography variant='subtitle1'>Settings List</Typography>
        {console.log(props.metadata.public)}
        <form>
          <label>
            Name:
            <input type="text" id="track-name" defaultValue={props.metadata.trackName} placeholder="Name"/>
          </label>
          <label>
            Tag:
            <input type="text" id="track-tag" defaultValue={props.metadata.tag} placeholder="Tag"/>
          </label>
          <label>
            Public:
            <input type="checkbox" id="track-publicity" defaultChecked={props.metadata.public}/>
          </label>
          {/* <input type="text" id="track-tag" placeholder="Tag" value={props.metadata.tag}/>
          <input type="checkbox" id="track-publicity" checked={props.metadata.publicity}/>Public */}
        </form>
        {settingsArray.map((setting, index) => {
          return (<Button variant='outlined' key={index} onClick={setting.handler}>{setting.name}</Button>);
        })}
      </Drawer>
      {/* <Box
      sx={{
        display: {xs: 'none', md: 'block'},
        border: 1,
        gridColumn: {xs: '3', md: '3'},
        gridRow: {xs: '4', md: '2 / 4'}
      }}>
        {settingsArray.map((setting, index) => {
          return (<Button variant='outlined' key={index} onClick={setting.handler}>{setting.name}</Button>);
        })}
      </Box> */}
    </>
  );
};

export default SettingsList;