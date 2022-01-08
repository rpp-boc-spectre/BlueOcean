import React, { useRef, useState } from "react";
import { useSnackbar } from 'material-ui-snackbar-provider';
import { Button, TextField, Typography, Alert } from "@mui/material";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default function SignIn() {

  let snackbar = useSnackbar();

  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const handleSubmit = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, formEmail, formPassword)
    .then((userCredential) => {
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }


  return (
    <>
      <Typography>SignIn Component</Typography>
      <ValidatorForm onSubmit={handleSubmit}>
        <TextValidator
          label="Email"
          onChange={e => {setFormEmail(e.target.value)}}
          name="email"
          value={formEmail}
          validators={['required', 'isEmail']}
          errorMessages={['this field is required', 'email is not valid']}
        />
        <br />
        <TextValidator
          label="Password"
          onChange={e => {setFormPassword(e.target.value)}}
          name="password"
          value={formPassword}
          validators={['required']}
          errorMessages={['this field is required']}
        />
        <br />
        <Button variant="contained" type="submit">Submit</Button>
      </ValidatorForm>
    </>
  )
}