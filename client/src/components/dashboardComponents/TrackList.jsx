import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import List from '@mui/material/List'
import Typography from "@mui/material/Typography";

import { getAllTracks } from "../../utils/database";
import TrackListItem from './TrackListItem.jsx';
import TaggedTracks from './TaggedTracks.jsx';

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

  let sortedTracks = {
    General: [],
    Rock: [],
    Electric: [],
    Folk: [],
    Pop: []
  };

  const trackSorter = () => {
    tracks.map((track) => {
      const tag = track.meta ? track.meta.tag : 'General';
      sortedTracks[tag].push(track);
    });
  }
  trackSorter();
  const tagList = Object.keys(sortedTracks);
  //console.log('SORTED', tagList);
  return (
    <>
      <Box>
        <Typography align='center' variant='h5'>Your Tracks</Typography>
        {tagList.map((tag, index) => {
          return <TaggedTracks tag={tag} tracks={sortedTracks[tag]} key={index} />
        })}
      </Box>
    </>
  )
}