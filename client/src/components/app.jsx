
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserContext from '../context/UserContext.js';
import useUserData from '../hooks/useUserData.js';
import { LayerStoreProvider } from "../context/LayerContext.js";
import { initialState, layerTableReducer } from "../lib/layerTableReducer.js";
import Paper from '@mui/material/Paper';
import { Toaster } from 'react-hot-toast';

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
    <UserContext.Provider value={userData}>
      <LayerStoreProvider initialState={initialState} reducer={layerTableReducer}>
        <div className="App">
          <Paper sx={{ bgcolor: 'grey.900' }}>
            <ResponsiveHeader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path='login' element={<Entry />} />
              <Route path='edit/:trackId' element={
                <RequireAuth>
                  <Editor />
                </RequireAuth>
              } />
              <Route path='edit' element={
                <RequireAuth>
                  <Editor />
                </RequireAuth>
              } />
              <Route path='dashboard' element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />
              <Route path='*' element={<NotFound />} />
            </Routes>
            <Toaster
              position="top-center"
              reverseOrder={false}
            />
          </Paper>
        </div>
      </LayerStoreProvider>
    </UserContext.Provider>
  );
}