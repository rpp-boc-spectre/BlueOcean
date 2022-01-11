import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeTrack } from '../../utils/database'
import useSnackbar from 'material-ui-snackbar-provider/lib/useSnackbar';

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TrackListItem({ trackId, meta, index, getUserTracks }) {
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

  const [dialogState, setDialogState] = useState(false);
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/edit/${trackId}`)
  };

  const handleDelete = () => {
    console.debug('Delete clicked! ', trackId)
    removeTrack(trackId)
      .then(() => {
        getUserTracks()
        snackbar.showMessage(<Alert severity='success'>Track Deleted</Alert>)
      })
      .catch((error) => {
        snackbar.showMessage(<Alert severity='error'>Error deleting your track :(</Alert>)
        console.debug('Dashboard: handleDelete: ', error)
      })
      .finally(() => {
        handleClose();
      });
  }

  const handleClose = () => {
    setDialogState(false)
  }

  let icon = <LockIcon />;
  if (publicSetting) {
    icon = <PublicIcon />
  }

  return (
    <>
      <ListItem
        sx={{ px: '5px' }}
        secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={() => { setDialogState(true) }}>
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
      <Dialog
        open={dialogState}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: 'white',
            boxShadow: 'none',
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to delete ${displayName}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this track can not be undone. Your recorded layers will NOT be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' color="error" onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}