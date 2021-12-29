import { Button, TextField, Typography, Alert } from "@mui/material";
import React, { useRef, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../lib/firebase'
import { useSnackbar } from 'material-ui-snackbar-provider';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { db } from '../lib/firebase.js';
import { doc, setDoc} from 'firebase/firestore'


export default function SignUp({ navigate }) {
  let snackbar = useSnackbar();

  const formRef = useRef()
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRePassword, setFormRePassword] = useState('')
  const [formUsername, setFormUsername] = useState('')

  const handleSubmit = () => {
    createUserWithEmailAndPassword(auth, formEmail, formPassword)
    .then(userCredential => {
      let user = userCredential.user
      return setDoc(doc(db, 'users', user.uid), { username: formUsername })
    })
    .then(() => {
      snackbar.showMessage(<Alert severity="success" sx={{ width: '100%' }}>User Created</Alert>)
      navigate('/dashboard')
    })
    .catch(error => {
      console.log(error)
      snackbar.showMessage(<Alert severity="error" sx={{ width: '100%' }}>There was an error creating your account</Alert>)
    })
  }

  ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
    if (value !== formPassword) {
        return false;
    }
    return true;
});

  return (
    <>
      <Typography variant="h3">SignUp Component</Typography>
      <ValidatorForm ref={formRef} onSubmit={handleSubmit}>
        <TextValidator
          label="Email"
          onChange={e => {setFormEmail(e.target.value)}}
          name="email"
          value={formEmail}
          validators={['required', 'isEmail']}
          errorMessages={['this field is required', 'email is not valid']}
        />
        <TextValidator
          label="Username"
          onChange={e => {setFormUsername(e.target.value)}}
          name="username"
          value={formUsername}
          validators={['required']}
          errorMessages={['this field is required']}
        />
        <br />
        <TextValidator
          label="Password"
          onChange={e => {setFormPassword(e.target.value)}}
          name="password"
          type="password"
          validators={['required']}
          errorMessages={['this field is required']}
          value={formPassword}
        />
        <TextValidator
          label="Repeat password"
          onChange={e => {setFormRePassword(e.target.value)}}
          name="repeatPassword"
          type="password"
          validators={['isPasswordMatch', 'required']}
          errorMessages={['password mismatch', 'this field is required']}
          value={formRePassword}
        />
        <br/>
        <Button variant="contained" type="submit">Submit</Button>
      </ValidatorForm>
    </>
  )
}