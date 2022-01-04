import React, { useRef, useState, useReducer } from 'react'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { useSnackbar } from 'material-ui-snackbar-provider'

import { uploadFile } from '../utils/storage'

const initalState = { testVar: [1] }

const reducer = function (state, action) {
  switch (action.type) {
    case 'addNewItem':
      return { testVar: [...state.testVar, action.payload] };
    default:
      throw new Error();
  }
}


export default function UploadFile() {

  const [inputFileName, setInputFileName] = useState('')
  const inputFileRef = useRef()
  const snackbar = useSnackbar()
  const [state, dispatch] = useReducer(reducer, initalState);

  const checkFileSize = (e) => {
    setInputFileName(inputFileRef.current.files[0].name)
    if (inputFileRef.current.files[0].size > 1000000) {
      inputFileRef.current.value = ''
      snackbar.showMessage(<Alert severity="error">This file is too big! uwu</Alert>)
    }
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
    </>

  )
}