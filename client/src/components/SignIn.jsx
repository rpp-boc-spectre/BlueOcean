import React, { useRef, useState } from "react";
<<<<<<< HEAD
import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
=======
import { useSnackbar } from 'material-ui-snackbar-provider';
import { Button, TextField, Typography, Alert, Stack, Box } from "@mui/material";
>>>>>>> main
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


<<<<<<< HEAD
export default function SignIn() {
=======
export default function SignIn({navigate}) {

  let snackbar = useSnackbar();

>>>>>>> main
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const handleSubmit = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, formEmail, formPassword)
<<<<<<< HEAD
      .then((userCredential) => {
        toast.custom(<Alert variant='filled' severity="success" color='primary'>{`Welcome, ${userCredential.user.displayName}`}</Alert>)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.custom(<Alert variant='filled' severity="error">There was an error signing you in</Alert>)
      });
=======
    .then((userCredential) => {
      navigate('/dashboard');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('ERROR SIGNIN', error.message);
    });
>>>>>>> main
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
<<<<<<< HEAD
          onChange={e => { setFormPassword(e.target.value) }}
=======
          type="password"
          onChange={e => {setFormPassword(e.target.value)}}
>>>>>>> main
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