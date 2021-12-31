import React from 'react';

import { Box, Typography } from '@mui/material';


const Timebox = () => {
  return (
    <>
      <Box sx={{
        border: 3,
        gridColumn: {xs: '2 / 4', md: '1'},
        gridRow: {xs: '3', md: '2'}
      }}>
        <Typography variant='subtitle1'>Timebox</Typography>
      </Box>
    </>
  );
};

export default Timebox;