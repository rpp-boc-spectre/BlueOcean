import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export default function TrackListItem({ trackId }) {

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/edit/${trackId}`)
  }

  return (
    <ListItem>
      <ListItemButton onClick={handleNavigation}>
        <ListItemText primary={trackId} />
      </ListItemButton>
    </ListItem>
  )
}