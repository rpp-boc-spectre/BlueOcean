import React from 'react';


import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';


const LayerEntry = (props) => {
  // console.log('ENTRY PROPS', props);
  return (
    <>
    <FormControlLabel
      label={'Layer' + props.number}
      control={<Checkbox />}
    />
    </>
  );
};

export default LayerEntry;