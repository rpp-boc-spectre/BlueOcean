import React, { useRef, useState } from "react";
import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default function SignIn() {
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const handleSubmit = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, formEmail, formPassword)
      .then((userCredential) => {
        toast.custom(<Alert variant='filled' severity="success">{`Welcome, ${userCredential.user.displayName}`}</Alert>)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.custom(<Alert variant='filled' severity="error">There was an error signing you in</Alert>)
      });
  }


  return (
    <>
      <Typography>SignIn Component</Typography>
      <ValidatorForm onSubmit={handleSubmit}>
        <TextValidator
          label="Email"
          onChange={e => { setFormEmail(e.target.value) }}
          name="email"
          value={formEmail}
          validators={['required', 'isEmail']}
          errorMessages={['this field is required', 'email is not valid']}
        />
        <br />
        <TextValidator
          label="Password"
          onChange={e => { setFormPassword(e.target.value) }}
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