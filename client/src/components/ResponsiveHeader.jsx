import React from "react";

import { AppBar, Box, Button, Container, CssBaseline, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { OfflineBolt, SearchIcon } from '@mui/icons-material';

// search bar
const SearchBar = () => {
  return (
    <>
      <Typography sx={{ flexGrow: 1 }}>.   SEARCH WIP</Typography>
    </>
  )
}

// menu options
const pages = ['Home', 'Your Tracks', 'Editor'];
const settings = ['Logout'];

// main component
const ResponsiveHeader = () =>{
  // anchors for menu
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // handlers for opening and closing menus
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = (event) => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = (event) => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <OfflineBolt
              size="large"
              edge="start"
              color="inherit"
              aria-label="LogoMenu"
              sx={{ mr: 2 }}
              />
            <Typography
              variant='h6'
              component='div'
              color='inherit'
              >
              ZAP
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              {/* STILL WORKING HERE */}
            </Box>
            <SearchBar />
            <Button
              variant='contained'
              onClick={() => {console.log('CLICKED')}}
              >
              Login
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default ResponsiveHeader;