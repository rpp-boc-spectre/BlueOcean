import React from "react";

import Box from '@mui/material/Box';
import List from '@mui/material/List'
import Typography from "@mui/material/Typography";

import TrackListItem from './TrackListItem.jsx';

export default function TaggedTracks(props) {
  const tracks = props.tracks;
  return (
    <>
      <Box>
        <Typography align='center' variant='h6'>Tracks Tagged {props.tag}</Typography>
        <List>
          {tracks.map((track, index) => {
            return <TrackListItem trackId={track.id} meta={track.metadata} key={index} />
          })}
        </List>
      </Box>
    </>
  )
}