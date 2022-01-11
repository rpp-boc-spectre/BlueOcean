import { Button, TextField, Typography, Alert, Stack, Box } from "@mui/material";
import React, { useRef, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../lib/firebase'
import toast from 'react-hot-toast';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { db } from '../lib/firebase.js';
import { doc, setDoc } from 'firebase/firestore'


export default function SignUp({ navigate }) {
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
        toast.custom(<Alert variant="filled" severity="success" color='primary'>User Created</Alert>)
        navigate('/dashboard')
      })
      .catch(error => {
        toast.custom(<Alert variant="filled" severity="error">There was an error creating your account</Alert>)
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
      <Typography variant="h3">Create an Account</Typography>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={{ xs: 1, md: 2 }}
      >
      <ValidatorForm ref={formRef} onSubmit={handleSubmit}>
        <TextValidator
          label="Email"
          onChange={e => { setFormEmail(e.target.value) }}
          name="email"
          value={formEmail}
          validators={['required', 'isEmail']}
          errorMessages={['this field is required', 'email is not valid']}
        />
        <TextValidator
          label="Username"
          onChange={e => { setFormUsername(e.target.value) }}
          name="username"
          value={formUsername}
          validators={['required']}
          errorMessages={['this field is required']}
        />
        <br />
        <TextValidator
          label="Password"
          onChange={e => { setFormPassword(e.target.value) }}
          name="password"
          type="password"
          validators={['required']}
          errorMessages={['this field is required']}
          value={formPassword}
        />
        <TextValidator
          label="Repeat password"
          onChange={e => { setFormRePassword(e.target.value) }}
          name="repeatPassword"
          type="password"
          validators={['isPasswordMatch', 'required']}
          errorMessages={['password mismatch', 'this field is required']}
          value={formRePassword}
        />
<<<<<<< HEAD
        <br />
        <Button variant="contained" type="submit">Submit</Button>
=======

        <br/>
        <Box textAlign="center">
          <Button variant="contained" type="submit">Submit</Button>
        </Box>
>>>>>>> main
      </ValidatorForm>
      </Stack>
    </>
  )
}