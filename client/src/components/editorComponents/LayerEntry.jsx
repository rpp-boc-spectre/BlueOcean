import React from 'react';


import { Box, Typography } from '@mui/material';


const LayerEntry = (props) => {
  // console.log('ENTRY PROPS', props);
  return (
    <>
      <Typography variant='subtitle1'>Layer {props.number}</Typography>
    </>
  );
};

export default LayerEntry;