import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import UserContext from "../context/UserContext.js";

import TrackList from "./dashboardComponents/TrackList.jsx";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useSnackbar } from 'material-ui-snackbar-provider'

export default function Dashboard() {

  const userData = useContext(UserContext)
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      snackbar.showMessage(<Alert severity="success" sx={{ width: '100%' }}>Successfully Signed Out</Alert>)
      navigate('/');
    } catch (error) {
      console.log(error)
      snackbar.showMessage(<Alert severity="error" sx={{ width: '100%' }}>{`There was an error signing you out :(`}</Alert>)
    }
  }

  return (
    <>
      <Box mx='auto' mt='10px' p='5px' sx={{ width: {xs: '100', md: '70vw'}, maxWidth: '1000px', maxHeight: '100vh', overflow:'auto', border: '2px solid black' }}>
        <Typography variant='h3' align='center'>Welcome {userData.username}</Typography>
        { userData.user && <TrackList userId={userData.user.uid}/> }
      </Box>
    </>
  )
}