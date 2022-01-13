import React, { useRef, useState } from "react";
import toast from 'react-hot-toast';
import { Button, TextField, Typography, Alert, Stack, Box } from "@mui/material";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default function SignIn({ navigate }) {
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const handleSubmit = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, formEmail, formPassword)
      .then((userCredential) => {
        toast.custom(<Alert variant='filled' severity="success" color='primary'>Welcome!</Alert>)
        navigate('/dashboard');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.custom(<Alert variant='filled' severity="error">There was an error signing you in.</Alert>)
      });
  }


  return (
    <>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={{ xs: 1, md: 2 }}
      >
        <ValidatorForm onSubmit={handleSubmit}>
          <TextValidator
            label="Email"
            onChange={e => { setFormEmail(e.target.value) }}
            name="email"
            value={formEmail}
            validators={['required', 'isEmail']}
            errorMessages={['Email is required', 'Email is not valid']}
          />
          <br />
          <TextValidator
            label="Password"
            type="password"
            onChange={e => { setFormPassword(e.target.value) }}
            name="password"
            value={formPassword}
            validators={['required']}
            errorMessages={['Password is required']}
          />
          <br />
          <Box textAlign="center">
            <Button variant="contained" type="submit">Submit</Button>
          </Box>
        </ValidatorForm>
      </Stack>
    </>
  )
}