import React, { useContext, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { useSnackbar } from 'material-ui-snackbar-provider'

import { uploadFile } from '../utils/storage'
import UserContext from '../context/UserContext'


export default function UploadFile() {

  const { user } = useContext(UserContext)
  const [inputFileName, setInputFileName] = useState('')
  const [fileError, setFileError] = useState(false)
  const inputFileRef = useRef()
  const snackbar = useSnackbar()

  const checkFileSize = (e) => {
    setInputFileName(inputFileRef.current.files[0].name)
    if (inputFileRef.current.files[0].size > 5000000) {
      inputFileRef.current.value = ''
      snackbar.showMessage(<Alert severity="error">This file is too big! uwu</Alert>)
    }
  }

  const handleFileUpload = () => {
    uploadFile(inputFileRef.current.files[0], user.uid)
      .then(() => {
        snackbar.showMessage(<Alert severity='success'>{`${inputFileName} uploaded successfully`}</Alert>)
        setInputFileName('')
        inputFileRef.current.value = ''
      })
      .catch((error) => {
        console.log(error)
        snackbar.showMessage(<Alert severity="error">There was an error uploading your file. Try again later.</Alert>)
      })
  }

  return (
    <>
      <Button
        variant="contained"
        component="label"
      >
        Upload File
        <input
          accept=".mp3, .webm"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          ref={inputFileRef}
          onChange={checkFileSize}
        />
      </Button>
      <h3>{inputFileName}</h3>
      <Button
        variant='contained'
        disabled={fileError || inputFileName.length < 1}
        onClick={handleFileUpload}
      >
        Submit
      </Button>
    </>

  )
}