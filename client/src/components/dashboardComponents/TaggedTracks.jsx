import React from "react";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

import TrackListItem from './TrackListItem.jsx';

export default function TaggedTracks({ tag, tracks, getTracks, removedTrack }) {
  if (tracks.length < 1) {
    return <></>
  } else {
    return (
      <>
      <Box>
        <Typography align='center' variant='h6'>Tracks Tagged {tag}</Typography>
        <Grid container spacing='2'>
          {tracks.map((track, index) => {
            return (
              <Grid item key={index}>
                <TrackListItem
                  trackId={track.id}
                  meta={track.meta}
                  index={index}
                  getTracks={getTracks}
                  removedTrack={removedTrack}
                />
              </Grid>)
          })}
        </Grid>
      </Box>
    </>
    )
  }
};