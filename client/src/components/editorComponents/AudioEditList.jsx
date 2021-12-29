import React from 'react';
import AudioEditBox from './AudioEditBox.jsx';
import AudioEditButton from './AudioEditButton.jsx';

import { Box, Typography } from '@mui/material';

/*
Actual editing options and their respective functions subject to change, and their
handlers might need to be moved to the Editor component to properly interact with
everything else and be passed down as props, but for now, they live here
*/



class AudioEditList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOption: 'Volume',
      userType: 'Free'
    };
    this.editPitch = this.editPitch.bind(this);
    this.editTempo = this.editTempo.bind(this);
    this.editVolume = this.editVolume.bind(this);
  }

  // functions just for switching "active editing option"
  editPitch = () => {
    console.log('CLICKED PITCH');
    console.log('THIS', this);
    this.setState({activeOption: 'Pitch'});
  }

  editTempo = () => {
    console.log('CLICKED TEMPO');
    this.setState({activeOption: 'Tempo'});
  }

  editVolume = () => {
    console.log('CLICKED VOLUME');
    this.setState({activeOption: 'Volume'});
  }

  freeOptions = [
    {name: 'Volume', handler: this.editVolume},
    {name: 'Pitch', handler: this.editPitch},
    {name: 'Tempo', handler: this.editTempo},
  ];

  render() {
    // logic for allowing paid users more features
    let options;
    if (this.state.userType === 'Free') {
      options = this.freeOptions;
    }
    let active = this.state.activeOption;
    console.log('ACTIVE', active);
    return (
      <>
        <Box sx={{ border: 1}}>
          <Typography variant='subtitle1'>Editing Options</Typography>
          <AudioEditBox active={this.state.activeOption}/>
          {options.map((option, index) => {
            return (<AudioEditButton key={index} option={option} />);
          })}
        </Box>
      </>
    );
  }
};

export default AudioEditList;