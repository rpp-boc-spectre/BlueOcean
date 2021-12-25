import 'regenerator-runtime/runtime'
import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Button, Alert } from '@mui/material'

import UserContext from "../context/UserContext.js";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from '../lib/firebase.js'
import { useSnackbar } from 'material-ui-snackbar-provider';

import { db } from '../lib/firebase.js';
import { doc, getDoc} from 'firebase/firestore'
import UserForm from './UserForm.jsx';

export default function Entry() {
  const userData = useContext(UserContext)
  const [showUserForm, setShowUserForm] = useState(false)

  let navigate = useNavigate();
  let location = useLocation();
  let snackbar = useSnackbar();

  let from = location.state?.from?.pathname || "/dashboard";

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      let result = await signInWithPopup(auth, provider)
      snackbar.showMessage(<Alert severity="success" sx={{ width: '100%' }}>Welcome {result.user.displayName}</Alert>)
      let username = await getUserName(result.user.uid)
      if (!username) {
        setShowUserForm(true)
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.log(error)
      snackbar.showMessage(<Alert severity="error" sx={{ width: '100%' }}>{`There was an error signing you in :(`}</Alert>)
    }
  }

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

  const getUserName = (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = doc(db, 'users', userId)
        let snapshot = getDoc(ref)
        if (snapshot.exists()) {
          let doc = snapshot.data()
          resolve(doc.username)
        } else {
          resolve(false)
        }
      } catch(error) {
        reject(error)
      }
    })
  }

  return (
    <>
      <Typography variant='h3'>Login Component</Typography>
      {(userData?.user && userData?.username) ?
        <Button variant="outlined" color="error" onClick={handleSignOut}>
          Signout
        </Button>
        :
        userData?.user ?
        <UserForm userId={userData.user.uid}/>
        :
        <Button variant="contained" onClick={handleSignInWithGoogle}>Sign In with Google</Button>
      }
    </>
  )
}