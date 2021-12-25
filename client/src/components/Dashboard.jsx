import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Alert } from '@mui/material'
import UserContext from "../context/UserContext.js";
import useSnackBar from '../hooks/useSnackBar.js';

import { signOut } from "firebase/auth";
import { auth } from '../lib/firebase.js'

export default function Dashboard() {

  const userData = useContext(UserContext)
  const navigate = useNavigate()
  const { addAlert } = useSnackBar()

  const handleSignOut = async () => {
    try {
      await signOut(auth)

      addAlert('Successfully Signed Out')
      navigate('/');
    } catch (error) {
      console.log(error)


    }
  }


  return (
    <>
    <Typography variant='h1'>Dashboard</Typography>
    <Typography variant='h3'>Welcome {userData.username}</Typography>
    <Button variant="outlined" color="error" onClick={handleSignOut}>
          Signout
    </Button>
    </>
  )
}