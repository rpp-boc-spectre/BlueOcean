import React from 'react';
import { useNavigate } from 'react-router-dom';

import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

export default function TrackListItem(props) {
  const trackId = props.track.id;
  const trackName = props.track.name || 'Unknown';
  const publicSetting = props.track.public || false;
  const tags = props.track.tags || ['untagged'];

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/edit/${trackId}`)
  }
  let icon = <LockIcon />;
  if (publicSetting) {
    icon = <PublicIcon />
  }

  return (
    <ListItem>
      <ListItemButton onClick={handleNavigation}>
        <ListItemText primary={trackId} />
        {tags.map((tag, index) => {
          return (<Chip key={index} label={tag} />)
        })}
        {icon}
      </ListItemButton>
    </ListItem>
  )
}