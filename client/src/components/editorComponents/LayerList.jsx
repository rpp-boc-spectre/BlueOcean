import React from 'react';

import LayerEntry from './LayerEntry.jsx';

import { Box, Typography } from '@mui/material';


const LayerList = (props) => {
  // console.log('PROPS', props);
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1,
          border: 1
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