import React from 'react';

import DisplayEntry from './DisplayEntry.jsx';
import Timebar from './Timebar.jsx';

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';


const DisplayList = (props) => {
  // console.log('PROPS', props);
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          gridColumn: {xs: '1 / 3', md:'2'},
          gridRow: {xs: '1', md: '1 / 3'},
          minHeight: '60vh',
          maxHeight: '80vh',
          padding: {xs: '0', md: '10px'},
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            overflow: 'auto',
          }}>
          <Typography variant='subtitle1'>Display List Box</Typography>
          {/* Would we need a display entry for all of the layers at once,
              for when a use might want to edit all the layers at once? I
              would guess that edits made while the "All" layer is selected
              will then by applied to all the layers' metadata...? */}
          <FormControlLabel
            label={'All Layers'}
            control={<Checkbox defaultChecked />}
          />
          {props.layers.map((layer, index) => {
            return (<DisplayEntry key={index} layer={layer} />);
          })}
        </Box>
        {/* <Timebar /> */}
      </Box>
    </>
  );
};

export default DisplayList;