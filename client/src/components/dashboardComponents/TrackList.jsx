import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import List from '@mui/material/List'
import Typography from "@mui/material/Typography";

import { getAllTracks } from "../../utils/database";
import TrackListItem from './TrackListItem.jsx';
import TaggedTracks from './TaggedTracks.jsx';

export default function TrackList({ userId }) {

  const [tracks, setTracks] = useState([])

  const getUserTracks = () => {
    getAllTracks(userId)
      .then(data => {
        setTracks(data)
      })
      .catch(error => {
        console.debug(error)
      })
  }

  const removeUserTrack = (index) => {
    setTracks((prev) => {
      prev.splice(index, 1);
      return prev
    })
  }

  useEffect(() => {
    getUserTracks()
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
        {tagList.map((tag, index) => {
          return <TaggedTracks tag={tag} tracks={sortedTracks[tag]} key={index} />
        })}
      </Box>
    </>
  )
}