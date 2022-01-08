import React from "react";
import { Typography, Grid, Card, CardContent, CardActionArea, Box } from '@mui/material'
import { useSnackbar } from "material-ui-snackbar-provider";

export default function HomeTrackBar ({ tracks, tag }) {
  return (
    <>
      <Typography variant='h4' mt={1}>Popular Tracks in {tag}</Typography>
      <Box sx={{margin: 2}}>
        <Grid container spacing={2}>
          {tracks.map((track, index) => <Grid item key={index}>
            <CardActionArea>
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