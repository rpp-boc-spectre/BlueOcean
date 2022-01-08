import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { getAllPublicTracks } from "../utils/database";
import { Typography, Button, Alert, Grid, Card, CardContent, CardActionArea, Box } from '@mui/material'
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
      <Box sx={{ width: '100%', height: 400}}>
        <Grid container spacing={2}>
          {tracks.map((track, index) => <Grid item key={index}>
            <Card sx={{ maxWidth: 300, height: 350 }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {track.meta.trackName}
                  </Typography>
                  <Typography variant="p" component="div">
                    {track.meta.tag}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>)}
        </Grid>
      </Box>
      <Link to='/dashboard'>
        <Button variant="contained">Dashboard</Button>
      </Link>
    </div>
  )
}