import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeTrack } from '../../utils/database'
import useSnackbar from 'material-ui-snackbar-provider/lib/useSnackbar';

import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/edit/${trackId}`)
  };

  const handleDelete = () => {
    console.debug('Delete clicked! ', trackId)
    removeTrack(trackId)
      .then(() => {
        snackbar.showMessage(<Alert severity='success'>Track Deleted</Alert>)
      })
      .catch((error) => {
        snackbar.showMessage(<Alert severity='error'>Error deleting your track :(</Alert>)
      });
  }

  let icon = <LockIcon />;
  if (publicSetting) {
    icon = <PublicIcon />
  }

  return (
    <ListItem
      sx={{ px: '5px' }}
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemButton onClick={handleNavigation} sx={{ px: '5px' }}>
        <ListItemText primary={displayName} />
        <Chip label={tag} />
        {icon}
      </ListItemButton>
    </ListItem>
  )
}