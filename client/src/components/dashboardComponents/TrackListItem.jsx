import React from 'react';
import { useNavigate } from 'react-router-dom';

import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

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
    <ListItem sx={{ px: '5px' }}>
      <ListItemButton onClick={handleNavigation} sx={{ px: '5px' }}>
        <ListItemText primary={displayName} />
        <Chip label={tag} />
        {icon}
      </ListItemButton>
    </ListItem>
  )
}