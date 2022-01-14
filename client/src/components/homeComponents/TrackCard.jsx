import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';


export default function TrackCard({ trackId, meta, tag }) {

  const handleNavigation = () => {
    navigate(`/edit/${trackId}`)
  };
  const displayName = meta.trackName;

  return (
    <Card sx={{
      height: {xs: '35vh', md: '200px'},
      width: {xs: '43vw', md: '250px'},
      overflowX: 'scroll',
      '&::-webkit-scrollbar': {
        display: 'none'
        },
      position: 'relative'
      }}>
      <CardActionArea onClick={handleNavigation} sx={{ p: '2px', height: '300px', maxHeight: '100%' }}>
        <CardContent sx={{position: 'absolute', top: '10px'}}>
          <Typography variant="h6">{displayName}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          height: 'fit-content',
          position: 'absolute',
          bottom: 0,
          width: '90%'
        }}
        >
        <Chip label={tag} />
      </CardActions>
    </Card>
  )
}



            // <CardActionArea onClick={() => navigate('/edit/' + track.id)}>
            //   <Card sx={{ height: 200, width: 300 }}>
            //     <CardContent>
            //       <Typography variant="h6" component="div">
            //         {track.meta.trackName}
            //       </Typography>
            //       <Typography variant="p" component="div">
            //         {track.meta.tag || "General"}
            //       </Typography>
            //     </CardContent>
            //   </Card>
            // </CardActionArea>
