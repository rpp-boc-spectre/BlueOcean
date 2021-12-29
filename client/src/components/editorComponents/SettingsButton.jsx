import React from 'react';

import { Button } from '@mui/material';

const SettingsButton = (props) => {
  const target = props.setting.name;
  return (
    <Button variant='outlined' onClick={props.setting.handler}>{target}</Button>
  );
};

export default SettingsButton;