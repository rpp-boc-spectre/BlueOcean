import 'regenerator-runtime/runtime'
import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Button, Alert } from '@mui/material'

import UserContext from "../context/UserContext.js";

import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut, getAuth } from "firebase/auth";
import { auth } from '../lib/firebase.js'
import toast from 'react-hot-toast';

import { db } from '../lib/firebase.js';
import { doc, getDoc } from 'firebase/firestore'
import UserForm from './UserForm.jsx';
import SignUp from './SignUp.jsx';
import SignIn from './SignIn.jsx';

export default function Entry() {
  const userData = useContext(UserContext)
  const [showUserForm, setShowUserForm] = useState(false)
  const [signIn, setSignIn] = useState(true)

  let navigate = useNavigate();
  let location = useLocation();

  let from = location.state?.from?.pathname || "/dashboard";

  const handleSignInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      let result = await signInWithPopup(auth, provider);
      toast.custom(<Alert severity="success" color="primary" sx={{ width: '100%' }}>Welcome {result.user.displayName}</Alert>)
      let username = await getUserName(result.user.uid)
      if (!username) {
        setShowUserForm(true)
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.custom(<Alert severity="error" sx={{ width: '100%' }}>{`There was an error signing you in :(`}</Alert>)
    }
  }

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      let result = await signInWithPopup(auth, provider)
      toast.custom(<Alert severity="success" color="primary" sx={{ width: '100%' }}>Welcome {result.user.displayName}</Alert>)
      let username = await getUserName(result.user.uid)
      if (!username) {
        setShowUserForm(true)
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.custom(<Alert severity="error" sx={{ width: '100%' }}>{`There was an error signing you in :(`}</Alert>)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.custom(<Alert severity="success" color="primary" sx={{ width: '100%' }}>Successfully Signed Out</Alert>)
      navigate('/');
    } catch (error) {
      toast.custom(<Alert severity="error" sx={{ width: '100%' }}>{`There was an error signing you out :(`}</Alert>)
    }
  }

  const getUserName = (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = doc(db, 'users', userId)
        let snapshot = await getDoc(ref)
        let data = snapshot.data()
        if (data && data.username) {
          resolve(data.username)
        } else {
          resolve(null)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  const entryType = () => {
    if (signIn) {
      return (
        <>
          {(userData?.user && userData?.username) ?
            <Button variant="outlined" color="error" onClick={handleSignOut}>
              Signout
            </Button>
            :
            showUserForm ?
              <UserForm userId={userData.user.uid} />
              :
              <>
                <SignIn />
                <>
                  <Button variant="contained" onClick={handleSignInWithGoogle}>Sign In with Google</Button>
                  <Button variant="contained" onClick={handleSignInWithFacebook}>Sign In with Facebook</Button>
                  <Button variant="outlined" onClick={() => { setSignIn(false) }}>Sign Up</Button>
                </>
              </>
          }
        </>
      )
    } else {
      return (<SignUp navigate={navigate} />)
    }
  }

  return (
    <>
      <Typography variant='h3'>Login Component</Typography>

      {entryType()}
    </>
  )
}