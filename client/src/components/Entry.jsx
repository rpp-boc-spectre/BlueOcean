import React, { useContext, useState } from "react";
import 'regenerator-runtime/runtime'
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import UserContext from "../context/UserContext.js";
import { auth } from '../lib/firebase.js'
import { Typography, Button, Snackbar } from '@mui/material'

export default function Entry() {
  const userData = useContext(UserContext)
  const [openStatus, setOpenStatus] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      let result = await signInWithPopup(auth, provider)
      setStatus({
        message: `Welcome ${result.user.displayName}`,
        option: 'success'
      })
      setOpenStatus(true)
    } catch (error) {
      console.log(error)
      setStatus({
        message: `There was an error logging you in :(`,
        option: 'error'
      })
      setOpenStatus(true)
    }
  }

  const handleSignOut = async () => {

    try {
      await signOut(auth)
      setStatus({
        message: `Signed Out Successfully`,
        option: 'success'
      })
      setOpenStatus(true)
    } catch (error) {
      console.log(error)
      setStatus({
        message: `There was an error signing you out :(`,
        option: 'error'
      })
      setOpenStatus(true)
    }
  }

  const handleClose = () => {
    setOpenStatus(false)
  }

  return (
    <>
      <Typography variant='h3'>Login Component</Typography>
      {userData?.user ?
        <Button variant="outlined" color="error" onClick={handleSignOut}>
          Signout
        </Button>
        :
        <Button variant="contained" onClick={handleSignInWithGoogle}>Sign In with Google</Button>
      }
      <Snackbar
        open={openStatus}
        autoHideDuration={5000}
        onClose={handleClose}
        message={status?.message}
        severity={status?.option}
      />
    </>
  )
}