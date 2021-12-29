import React from "react";
import { Link } from 'react-router-dom'

import ResponsiveHeader from './ResponsiveHeader.jsx';

import { Typography, Button } from '@mui/material'

export default function Home() {
  return (
    <div>
  {/*
    HARDCODED LOGGED IN VALUE; SORRY I'M NOT EXACTLY SURE HOW YOU
    ARE CHECKING IF LOGGED IN ALREADY OR NOT
    */}
      <ResponsiveHeader loggedIn='false' page='home' />
      <Typography variant='h1'>I am rendered with React and Material-UI!</Typography>
      <Link to='/dashboard'>
        <Button variant="contained">Dashboard</Button>
      </Link>
    </div>
  )
}