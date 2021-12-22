import React from 'react';


import { Box, Typography } from '@mui/material';


const DisplayEntry = (props) => {
  // console.log('ENTRY PROPS', props);
  return (
    <>
      <Typography variant='subtitle1'>{props.layer.id}</Typography>
    </>
  );
};

export default DisplayEntry;