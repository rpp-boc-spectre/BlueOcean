import React from 'react';
import AudioEditBox from './AudioEditBox.jsx';

import { Box, Typography, Button } from '@mui/material';

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
    return (
      <>
        <Box sx={{
          border: 1,
          gridColumn: {xs: '1 / 4', md: '2'},
          gridRow: {xs: '2', md: '2 / 4'}
        }}>
          <Typography variant='subtitle1'>Editing Options</Typography>
          <AudioEditBox active={this.state.activeOption}/>
          {options.map((option, index) => {
            return (<Button variant='outlined' key={index} onClick={option.handler}>{option.name}</Button>);
          })}
        </Box>
      </>
    );
  }
};

export default AudioEditList;