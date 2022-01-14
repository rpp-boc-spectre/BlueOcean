import 'regenerator-runtime/runtime'
import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Button, Alert, Container, Stack, Divider, Paper, Box } from '@mui/material'

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
      toast.custom(<Alert variant='filled' severity="success" color="primary">Welcome {result.user.displayName}</Alert>)
      let username = await getUserName(result.user.uid)
      if (!username) {
        setShowUserForm(true)
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.custom(<Alert variant='filled' severity="error">{`There was an error signing you in :(`}</Alert>)
    }
  }

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      let result = await signInWithPopup(auth, provider)
      toast.custom(<Alert variant='filled' severity="success" color="primary">Welcome {result.user.displayName}</Alert>)
      let username = await getUserName(result.user.uid)
      if (!username) {
        setShowUserForm(true)
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.custom(<Alert variant='filled' severity="error">{`There was an error signing you in :(`}</Alert>)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.custom(<Alert variant='filled' severity="success" color="primary">Successfully Signed Out</Alert>)
      navigate('/');
    } catch (error) {
      toast.custom(<Alert variant='filled' severity="error">{`There was an error signing you out :(`}</Alert>)
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
              <Box
                sx={{
                  bgcolor: 'primary.light',
                  width: { xs: '90%', md: '80%' },
                  pb: 1,
                  height: { xs: '84vh', md: '87vh' }
                }}
                mx='auto'
              >
                <Typography
                  sx={{
                    pt: 10,
                    pb: 4,
                    fontSize: { xs: '10vw', sm: '7vw', md: '5vw' }
                  }}
                  textAlign="center"
                >
                  Welcome back
                </Typography>
                <Stack spacing={{ xs: 1, md: 2 }}>
                  <SignIn navigate={navigate} />
                </Stack>
                <>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={{ xs: 1, md: 2 }}
                    justifyContent="center"
                    width={{ xs: '160px', sm: '450px', md: '600px' }}
                    mx="auto"
                  >
                    <Button
                      variant="outlined"
                      onClick={handleSignInWithGoogle}
                      sx={{
                        color: 'grey.50',
                        bgcolor: 'buttons.googleFB',
                        ':hover': {bgcolor: 'buttons.googleFBhover'},
                        border: 1,
                        borderColor: 'buttons.googleFBborder',
                        width: { xs: '150px', sm: '175px', md: '200px' },
                        fontSize: { xs: 12, sm: 13, md: 14 }
                      }}
                    >
                      Sign In with Google
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleSignInWithFacebook}
                      sx={{
                        color: 'grey.50',
                        bgcolor: 'buttons.googleFB',
                        ':hover': {bgcolor: 'buttons.googleFBhover'},
                        border: 1,
                        borderColor: 'buttons.googleFBborder',
                        width: { xs: '150px', md: '200px' },
                        fontSize: { xs: 12, sm: 13, md: 14 }
                      }}
                    >
                      Sign In with Facebook
                    </Button>
                  </Stack>
                  <br />
                  <Stack spacing={{ xs: 1, md: 2 }}>
                    <Typography
                      variant="subtitle2"
                      textAlign="center"
                    >
                      Don't have an account?
                      <br/>
                      <Button
                        variant="contained"
                        onClick={() => { setSignIn(false) }}
                        sx={{
                          mt: 1.5,
                          mb: { xs: 1, md: 3 },
                          color: 'grey.800',
                          bgcolor: 'secondary.main',
                          ':hover': { bgcolor: 'buttons.submitHover' },
                          border: 1,
                          borderColor: 'buttons.signupBorder',
                          width: { xs: '100px', md: '200px' }
                        }}
                      >
                        Sign Up
                      </Button>
                    </Typography>
                  </Stack>
                </>
                </Box>
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
      <Container spacing={2}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {entryType()}
        </Stack>
      </Container>
    </>
  )
}