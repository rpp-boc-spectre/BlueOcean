import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { getAllPublicTracks } from "../utils/database";
import { Typography, Button, Alert } from '@mui/material'
import { useSnackbar } from "material-ui-snackbar-provider";

export default function Home() {

  const [tracks, setTracks] = useState([])
  const snackbar = useSnackbar();

  const getPublicTracks = () => {
    getAllPublicTracks()
      .then((data) => {
        setTracks(data)
      })
      .catch((error) => {
        console.log(error)
        snackbar.showMessage(<Alert severity="error">Unable to get tracks</Alert>)
      })
  }

  useEffect(() => {
    getPublicTracks()
  }, [])

  return (
    <div>
      <Typography variant='h3'>Tracks</Typography>
      <ul>
        {tracks.map((track, index) => <p key={index}>{track.meta.trackName}</p>)}
      </ul>
      <Link to='/dashboard'>
        <Button variant="contained">Dashboard</Button>
      </Link>
    </div>
  )
}