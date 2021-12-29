import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Alert } from '@mui/material'
import UserContext from "../context/UserContext.js";
import { useSnackbar } from 'material-ui-snackbar-provider'

import { signOut } from "firebase/auth";
import { auth } from '../lib/firebase.js'

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
    <Typography variant='h1'>Dashboard</Typography>
    <Typography variant='h3'>Welcome {userData.username}</Typography>
    <Button variant="outlined" color="error" onClick={handleSignOut}>
          SignOut
    </Button>
    </>
  )
}