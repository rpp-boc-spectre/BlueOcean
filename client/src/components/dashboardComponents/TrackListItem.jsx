import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

export default function TrackListItem({ trackId, meta }) {
  //console.log('META', meta);
  let publicSetting, displayName, tag;
  if (meta && meta.public) {
    //console.log('PUBLIC SETTING', publicSetting)
    publicSetting = meta.public;
  } else {
    publicSetting = false;
  }
  if (meta && meta.trackName) {
    displayName = meta.trackName;
  } else {
    displayName = trackId;
  }
  if (meta && meta.tag) {
    tag = meta.tag;
  } else {
    tag = 'General';
  }


  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/edit/${trackId}`)
  };

  let icon = <LockIcon />;
  if (publicSetting) {
    icon = <PublicIcon />
  }

  return (
    <CardActionArea onClick={handleNavigation} sx={{ p: '2px' }}>
      <Card sx={{
        height: {xs: '35vh', md: '200px'},
        width: {xs: '43vw', md: '250px'},
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none'
        },
      }}>
        <CardContent>
          <Typography variant="h6">{displayName}</Typography>
          <Chip label={tag} />
          {icon}
        </CardContent>
      </Card>
    </CardActionArea>
  )
}