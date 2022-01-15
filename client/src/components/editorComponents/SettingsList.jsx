import React from 'react';

import {
  Box,
  Button,
  Drawer,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';

/*
Actual settings and their respective functions subject to change, and their
handlers might need to be moved to the Editor component to properly interact with
everything else and be passed down as props, but for now, they live here
*/

const tagsList = [
  "General",
  "Rock",
  "Electric",
  "Folk",
  "Pop"
];

const SettingsList = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [publicChecked, setPublicChecked] = React.useState(false);

  const container = window !== undefined ? () => window().document.body : undefined;

  const handlePublicToggle = (e) => {
    setPublicChecked(e.target.checked);
    props.updateMetadata({...props.metadata, public: !publicChecked});
  }

  const handleTagChange = (e) => {
    props.updateMetadata({...props.metadata, tag: e.target.value});
  }

  const handleTrackNameChange = (e) => {
    props.updateMetadata({...props.metadata, trackName: e.target.value});
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  React.useEffect(() => {
    if (props.metadata.public !== undefined && props.metadata.public !== publicChecked) {
      setPublicChecked(props.metadata.public);
    }
  }, [props.metadata]);

  const settingsArray = [
    { name: 'Save', handler: props.saveHandler }
  ];

  return (
    <>
      <Button
        color='black'
        variant='outlined'
        onClick={handleDrawerToggle}
        disabled={props.isPlaying}
      >
        <SaveIcon />
      </Button>
      <Drawer container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          border: 1,
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%', maxHeight: '80%' }
        }}>
        <Typography variant='subtitle1'>Settings List</Typography>
        <TextField
          id="track-name"
          label="Track Name"
          variant="outlined"
          value={props.metadata.trackName || ""}
          onChange={handleTrackNameChange}
        />
        <FormControl fullWidth>
          <InputLabel id="tag-select-label">Tag</InputLabel>
          <Select
            labelId="tag-select-label"
            id="track-tag-select"
            value={props.metadata.tag || "General"}
            onChange={handleTagChange}
            label="Tag"
          >
            {tagsList.map((tag, idx) => <MenuItem value={tag} key={idx}>{tag}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControlLabel
          id="track-publicity"
          control={<Switch checked={publicChecked} onChange={handlePublicToggle}/>}
          label={publicChecked ? "Public" : "Private"}
        />
        {settingsArray.map((setting, index) => {
          return (<Button variant='outlined' key={index} onClick={setting.handler}>{setting.name}</Button>);
        })}
      </Drawer>
    </>
  );
};

export default SettingsList;