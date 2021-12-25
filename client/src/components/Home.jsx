import React from "react";
import { Link } from 'react-router-dom'
import { Typography, Button } from '@mui/material'

export default function Home() {
  return (
    <div>
      <Typography variant='h1'>I am rendered with React and Material-UI!</Typography>
      <Link to='/dashboard'>
        <Button variant="contained">Dashboard</Button>
      </Link>
    </div>
  )
}