import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import List from '@mui/material/List'
import Typography from "@mui/material/Typography";

import { getAllTracks } from "../../utils/database";
import TrackListItem from './TrackListItem.jsx';

export default function TrackList({ userId }) {

  const [tracks, setTracks] = useState([])

  useEffect(() => {
    getAllTracks(userId)
      .then(data => {
        console.log(data)
        setTracks(data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <Typography>Track List Component</Typography>
      <Box sx={{ width: {xs: '100%', md: '70%'} }}>
        <List>
          {tracks.map((track, index) => {
            return <TrackListItem trackId={track.id} key={index} />
          })}
        </List>
      </Box>
    </>
  )
}