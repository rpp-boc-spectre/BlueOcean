import React from 'react';

import { Button } from '@mui/material';

const AudioEditButton = (props) => {
  const target = props.option.name;
  return (
    <Button variant='outlined' onClick={props.option.handler}>{target}</Button>
  );
};

export default AudioEditButton;