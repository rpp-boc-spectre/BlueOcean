import React from "react";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List'
import Typography from "@mui/material/Typography";

import TrackListItem from './TrackListItem.jsx';

export default function TaggedTracks({ tag, tracks, getUserTracks }) {
  return (
    <>
      <Box>
        <Typography align='center' variant='h6'>Tracks Tagged {tag}</Typography>
        <Grid container spacing='2'>
          {tracks.map((track, index) => {
            return (
              <Grid item key={index}>
                <TrackListItem trackId={track.id} meta={track.meta} />
              </Grid>)
          })}
        </Grid>
      </Box>
    </>
  )
};