import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import List from '@mui/material/List'
import { getAllTracks } from "../utils/database";

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
      <Box sx={{ width: '100%', height: 400, maxWidth: 360 }}>
        <List>
          {tracks.map((track, index) => {
            return <TrackListItem trackId={track.id} meta={track.metadata} key={index} />
          })}
        </List>
      </Box>
    </>
  )
}