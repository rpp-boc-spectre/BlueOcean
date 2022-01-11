import React, { useRef, useState } from "react";
import { useSnackbar } from 'material-ui-snackbar-provider';
import { Button, TextField, Typography, Alert } from "@mui/material";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default function SignIn({navigate}) {

  let snackbar = useSnackbar();

  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const handleSubmit = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, formEmail, formPassword)
    .then((userCredential) => {
      navigate('/dashboard');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('ERROR SIGNIN', error);
    });
  }


  return (
    <>
      <Typography variant="subtitle2">Email Address:</Typography>
      <ValidatorForm onSubmit={handleSubmit}>
        <TextValidator
          label="Email"
          onChange={e => {setFormEmail(e.target.value)}}
          name="email"
          value={formEmail}
          validators={['required', 'isEmail']}
          errorMessages={['Email is required', 'Email is not valid']}
        />
        <br />
        <Typography variant="subtitle2">Password:</Typography>
        <TextValidator
          label="Password"
          type="password"
          onChange={e => {setFormPassword(e.target.value)}}
          name="password"
          value={formPassword}
          validators={['required']}
          errorMessages={['Password is required']}
        />
        <br />
        <Button variant="contained" type="submit">Submit</Button>
      </ValidatorForm>
    </>
  )
}