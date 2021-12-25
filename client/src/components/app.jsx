
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserContext from '../context/UserContext.js';
import useUserData from '../hooks/useUserData.js';
import { SnackBarProvider } from '../context/SnackBarContext.js';

import Home from "./Home.jsx";
import NotFound from './NotFound.jsx'
import Entry from './Entry.jsx'
import RequireAuth from "./RequireAuth.jsx";
import Dashboard from './Dashboard.jsx'
import { Snackbar } from "@mui/material";

export default function App() {
  const userData = useUserData()

  return (
    <SnackBarProvider>
      <UserContext.Provider value={userData}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='login' element={<Entry />} />
            <Route path='dashboard' element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </SnackBarProvider>

  );
}