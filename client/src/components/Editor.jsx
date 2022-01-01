import React from "react";

import ResponsiveHeader from './ResponsiveHeader.jsx';
import DisplayList from './editorComponents/DisplayList.jsx';
import LayerList from './editorComponents/LayerList.jsx';
import Timebox from './editorComponents/Timebox.jsx';
import TimeControlBox from './editorComponents/TimeControlBox.jsx';
import SettingsList from './editorComponents/SettingsList.jsx';
import AudioEditList from './editorComponents/AudioEditList.jsx';

import { AppBar, Box, Button, Container, CssBaseline, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { OfflineBolt } from '@mui/icons-material';

/* temp example array of layers in track. actual format is up
   to the people who actually understand this. these would also
   probably be recieved through props or something */
const layers = [
  {id: 12345, name: 'Test1', url: 'http://location.com/details', meta: {start: 0, end: 30, tempo: 50, pitch: 50, volume: 50}},
  {id: 12346, name: 'Test2', url: 'http://location.com/details', meta: {start: 0, end: 30, tempo: 50, pitch: 50, volume: 50}},
  {id: 12347, name: 'Test3', url: 'http://location.com/details', meta: {start: 0, end: 30, tempo: 50, pitch: 50, volume: 50}},
  {id: 12348, name: 'Test4', url: 'http://location.com/details', meta: {start: 0, end: 30, tempo: 50, pitch: 50, volume: 50}}
];

/* temp example array of available editing settings and their handlers
   actual settings and functionality are still WIP, and they definitely
   would not be stored like this in the finished build.  */
const fakeVolumeHandler = () => {
  console.log('CLICKED VOLUME EDITOR')
}
const fakePitchHandler = () => {
  console.log('CLICKED PITCH EDITOR')
}
const fakeTempoHandler = () => {
  console.log('CLICKED TEMPO EDITOR')
}
const editSettings = [
  {name: 'Volume', component: 'VolumeEdit.jsx', handler: fakeVolumeHandler},
  {name: 'Pitch', component: 'PitchEdit.jsx', handler: fakePitchHandler},
  {name: 'Tempo', component: 'TempoEdit.jsx', handler: fakeTempoHandler}
];

export default function Editor() {
  return (
    <>
      <main>
        {/* Temp Text for Testing
        <Box
          sx={{
            bgcolor: '#cfe8fc',
            p: 5
          }}>
          <Typography
            component='h1'
            variant='h6'
            align='center'
            color='text.primary'
            gutterBottom
          >
              I am the page to edit audio tracks!
          </Typography>
        </Box> */}
        {/* Main Component */}
        <Container sx={{
          border: 1,
          maxHeight: '90vh',
          minHeight: {xs: '100%', md: '70%'},
          width: {xs: '100%', md: '70%'},
          display: 'grid',
          gridTemplateColumns: {xs: '3fr 2fr', md: '1fr 6fr'},
          gridTemplateRows: {xs: '5fr 1fr', md: '6fr 1fr'}
        }}>
          {/* <LayerList layers={layers} /> */}
          <DisplayList layers={layers} />
          {/* <Timebox /> */}
          <TimeControlBox />
          {/* <AudioEditList /> */}
          <SettingsList />
        </Container>
      </main>
    </>
  )
}