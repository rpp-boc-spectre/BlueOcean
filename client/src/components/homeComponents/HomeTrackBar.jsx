import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Grid, Card, CardContent, CardActionArea, Box, Divider } from '@mui/material';
import TrackCard from './TrackCard.jsx';

export default function HomeTrackBar ({ tracks, tag }) {
  const navigate = useNavigate();
  return (
    <>
      <Typography
        variant='h4'
        sx={{ mt: 5, mb: 2, ml: 1 }}
      >
        Popular Tracks in {tag}
      </Typography>
      <Box sx={{margin: 2}}>
        <Grid container spacing={2}>
          {tracks.map((track, index) => {
            return (
              <Grid item key={index}>
                <TrackCard trackId={track.id} meta={track.meta} tag={tag} />
              </Grid>
            )
          })}
        </Grid>
        <Divider sx={{ mt: 3}}/>
      </Box>
    </>
  );
}