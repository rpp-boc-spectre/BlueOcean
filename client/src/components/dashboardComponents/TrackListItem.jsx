import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeTrack } from '../../utils/database'
import toast from 'react-hot-toast';

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

// there's a lot of if/elses here to try and handle any tracks with improper metadata
export default function TrackListItem({ trackId, meta, getTracks, removedTrack, index }) {
  let publicSetting, displayName, tag;
  if (meta && meta.public) {
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

  const [dialogState, setDialogState] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/edit/${trackId}`)
  };

  const handleDelete = () => {
    console.debug('Delete clicked! ', trackId)
    removeTrack(trackId)
      .then(() => {
        getTracks()
        toast.custom(<Alert variant="filled" severity='success' color="primary">Track Deleted</Alert>)
      })
      .catch((error) => {
        toast.custom(<Alert severity='error'>Error deleting your track :(</Alert>)
        console.debug('Dashboard: handleDelete: ', error)
      })
      .finally(() => {
        handleClose();
        removedTrack(index);
      });
  }

  const handleClose = () => {
    setDialogState(false)
  }

  let icon = <LockIcon aria-label='Private Track' sx={{position: 'absolute', right: {md: '5px', xs: '10px'}}} />;
  if (publicSetting) {
    icon = <PublicIcon aria-label='Public Track' sx={{position: 'absolute', right: {md: '5px', xs: '10px'}}} />
  }

  return (
    <Card
      sx={{
        height: {xs: '35vh', md: '200px'},
        width: {xs: '43vw', md: '250px'},
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none'
          },
        position: 'relative',
        bgcolor: "secondary.main"
        }}
      >
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
        <IconButton
          aria-label="Delete Track"
          sx={{
            borderRadius: 8,
            color: "grey.900"
          }}
          onClick={handleDelete}
          >
          <DeleteIcon/>
        </IconButton>
        <Chip label={tag} />
        {icon}
      </CardActions>
    </Card>
  )
}