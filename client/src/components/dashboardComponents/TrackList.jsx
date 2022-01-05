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
        console.log('Track Data', data)
        setTracks(data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <Box>
        <Typography align='center' variant='h5'>Your Tracks</Typography>
        <List>
          {tracks.map((track, index) => {
            return <TrackListItem track={track} key={index} />
          })}
        </List>
      </Box>
    </>
  )
}