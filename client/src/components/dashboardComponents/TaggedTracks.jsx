import React from "react";

import Box from '@mui/material/Box';
import List from '@mui/material/List'
import Typography from "@mui/material/Typography";

import TrackListItem from './TrackListItem.jsx';

export default function TaggedTracks({ tag, tracks, getUserTracks }) {
  return (
    <>
      <Box>
        <Typography align='center' variant='h6'>Tracks Tagged {tag}</Typography>
        <List>
          {tracks.map((track, index) => {
            return <TrackListItem trackId={track.id} meta={track.meta} key={index} index={index} getUserTracks={getUserTracks} />
          })}
        </List>
      </Box>
    </>
  )
}