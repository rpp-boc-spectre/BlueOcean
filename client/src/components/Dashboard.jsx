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
      <Box mx='auto' mt='10px' sx={{ width: { xs: '100', md: '70vw' }, maxWidth: '1000px', maxHeight: '100vh', overflow: 'auto', border: '2px solid black' }}>
        <Typography variant='h3' align='center'>Welcome {userData.username}</Typography>
        {userData.user && <TrackList userId={userData.user.uid} />}
      </Box>
    </>
  )
}