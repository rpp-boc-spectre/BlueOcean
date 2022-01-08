import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Grid, Card, CardContent, CardActionArea, Box } from '@mui/material'

export default function HomeTrackBar ({ tracks, tag }) {
  const navigate = useNavigate();
  return (
    <>
      <Typography variant='h4' mt={1}>Popular Tracks in {tag}</Typography>
      <Box sx={{margin: 2}}>
        <Grid container spacing={2}>
          {tracks.map((track, index) => <Grid item key={index}>
            <CardActionArea onClick={() => navigate('/edit/' + track.id)}>
              <Card sx={{ height: 200, width: 300 }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {track.meta.trackName}
                  </Typography>
                  <Typography variant="p" component="div">
                    {track.meta.tag || "General"}
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>)}
        </Grid>
      </Box>
    </>
  );
}