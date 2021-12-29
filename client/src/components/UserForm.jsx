import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button'
import TextField from "@mui/material/TextField";
import SendIcon from '@mui/icons-material/Send'

import { db } from '../lib/firebase.js';
import { doc, setDoc} from 'firebase/firestore'

export default function UserForm({ userId }) {

  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const submitBttn = useRef()

  const handleSubmit = async () => {
    try {
      await setDoc(doc(db, 'users', userId), { username })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.log(error)
    }
  }

  const handleFormChange = (e) => {
    setUsername(e.target.value)
  }

  return(
    <>
      <TextField id="username-field" label="Username" variant="outlined" onChange={handleFormChange}/>
      <Button variant="contained" endIcon={<SendIcon />} onClick={handleSubmit} ref={submitBttn}>Submit</Button>
    </>
  )
}