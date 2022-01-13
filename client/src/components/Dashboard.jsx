import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext.js";
import TrackList from "./dashboardComponents/TrackList.jsx";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function Dashboard() {

  const userData = useContext(UserContext)
  const navigate = useNavigate()

  return (
    <>
      <Box
      mx='auto'
      my='10px'
      sx={{
        p: {xs: '10px', md: '15px'},
        width: {xs: '100', md: '70vw'},
        maxWidth: '1000px',
        maxHeight: {xs: '84vh', md:'87vh'},
        bgcolor: 'success.light',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none'
        },
        borderRadius: {xs: '0', md: '5%'}
      }}>
        <Typography variant='h3' align='center'>Welcome {userData.username}</Typography>
        {userData.user && <TrackList userId={userData.user.uid} />}
      </Box>
    </>
  )
}