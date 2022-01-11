import React, { useContext, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import toast from 'react-hot-toast';
import { uploadFile } from '../utils/storage'
import UserContext from '../context/UserContext'


export default function UploadFile() {
  const { user } = useContext(UserContext)
  const [inputFileName, setInputFileName] = useState('')
  const [fileError, setFileError] = useState(false)
  const inputFileRef = useRef()

  const checkFileSize = (e) => {
    setInputFileName(inputFileRef.current.files[0].name)
    if (inputFileRef.current.files[0].size > 1000000) {
      setFileError(true)
      inputFileRef.current.value = ''
      toast.custom(<Alert variant='filled' severity="error">This file is too big!</Alert>)
    } else {
      if (fileError) {
        setFileError(false)
      }
    }
  }

  const handleFileUpload = () => {
    uploadFile(inputFileRef.current.files[0], user.uid)
      .then(() => {
        toast.custom(<Alert variant='filled' severity='success' color='primary'>{`${inputFileName} uploaded successfully`}</Alert>)
        setInputFileName('')
        inputFileRef.current.value = ''
      })
      .catch((error) => {
        toast.custom(<Alert variant='filled' severity="error">There was an error uploading your file. Try again later.</Alert>)
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
        disabled={(fileError || inputFileName.length < 1)}
        onClick={handleFileUpload}
      >
        Submit
      </Button>
    </>

  )
}