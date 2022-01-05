
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserContext from '../context/UserContext.js';
import useUserData from '../hooks/useUserData.js';
import { SnackbarProvider } from 'material-ui-snackbar-provider'

import Home from "./Home.jsx";
import NotFound from './NotFound.jsx'
import Entry from './Entry.jsx'
import RequireAuth from "./RequireAuth.jsx";
import Dashboard from './Dashboard.jsx'
import ResponsiveHeader from './ResponsiveHeader.jsx';
import Editor from "./Editor.jsx";

export default function App() {
  const userData = useUserData()

  return (
    <SnackbarProvider SnackbarProps={{ autoHideDuration: 4000 }}>
      <UserContext.Provider value={userData}>
        <div className="App">
          <ResponsiveHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='login' element={<Entry />} />
            <Route path='edit/:trackId' element={<Editor />} />
            <Route path='edit' element={<Editor />} />
            <Route path='dashboard' element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </SnackbarProvider>
  );
}