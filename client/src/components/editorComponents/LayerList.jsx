import React from 'react';

import LayerEntry from './LayerEntry.jsx';

import { Box, Button, Drawer, Typography } from '@mui/material';


const LayerList = (props) => {
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
        gridColumn: {xs: '2', md: '1'},
        gridRow: {xs: '4', md: '1'}
      }}>
        <Typography>Layers</Typography>
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
          <Typography variant='subtitle1'>Layers</Typography>
        {props.layers.map((layer, index) => {
          return (<LayerEntry key={index} layer={layer} number={index} />);
        })}
      </Drawer>
      <Box
        sx={{
          bgcolor: 'background.paper',
          display: {xs: 'none', md: 'block'},
          overflow: 'auto',
          p: 1,
          border: 1,
          gridColumn: {xs: '2', md: '1'},
          gridRow: {xs: '4', md: '1'}
        }}
      >
        <Typography variant='subtitle1'>Layer List Box</Typography>
        {props.layers.map((layer, index) => {
          return (<LayerEntry key={index} layer={layer} number={index} />);
        })}
      </Box>
    </>
  );
};

export default LayerList;