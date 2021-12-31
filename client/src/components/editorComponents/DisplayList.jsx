import React from 'react';

import DisplayEntry from './DisplayEntry.jsx';
import Timebar from './Timebar.jsx';

import { Box, Typography } from '@mui/material';


const DisplayList = (props) => {
  // console.log('PROPS', props);
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1,
          border: 1,
          gridColumn: {xs: '1 / 4', md:'2 / 4'},
          gridRow: {xs: '1', md: '1'}
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1,
            border: 1,
            overflow: 'auto',
          }}>
          <Typography variant='subtitle1'>Display List Box</Typography>
          {/* Would we need a display entry for all of the layers at once,
              for when a use might want to edit all the layers at once? I
              would guess that edits made while the "All" layer is selected
              will then by applied to all the layers' metadata...? */}
          <DisplayEntry layer={{id: 'ALL?'}} />
          {props.layers.map((layer, index) => {
            return (<DisplayEntry key={index} layer={layer} />);
          })}
        </Box>
        <Timebar />
      </Box>
    </>
  );
};

export default DisplayList;