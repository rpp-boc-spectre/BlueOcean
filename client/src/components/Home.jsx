import React, { useEffect, useState } from "react";
import { getAllPublicTracks } from "../utils/database";
import { Alert } from '@mui/material'
import toast from 'react-hot-toast';

import HomeTrackBar from './HomeTrackBar.jsx';

export default function Home() {
  const [tracks, setTracks] = useState([])
  const [tagTypes, setTagTypes] = useState([])

  const getPublicTracks = () => {
    getAllPublicTracks()
      .then((data) => {
        setTracks(data)
        let tags = []
        data.forEach(track => {
          if (track.meta.tag !== undefined && !tags.includes(track.meta.tag)) {
            tags.push(track.meta.tag);
          }
        });
        setTagTypes(tags);
      })
      .catch((error) => {
        toast.custom(<Alert variant="filled" severity="error">Unable to get tracks</Alert>)
      })
  }

  useEffect(() => {
    getPublicTracks()
  }, [])

  return (
    <div>
      {tagTypes.map((tag, idx) => {
        let tempTracks = [];
        if (tag === "General") {
          tempTracks = tracks.filter(track => track.meta.tag === "General" || track.meta.tag === undefined || track.meta.tag === "");
        } else {
          tempTracks = tracks.filter(track => track.meta.tag === tag);
        }
        tempTracks = tempTracks.slice(0, 5); // Only get the first 5 for now
        return (<HomeTrackBar tracks={tempTracks} tag={tag} key={idx} />);
      })}
    </div>
  )
}