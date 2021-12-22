
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserContext from '../context/UserContext.js';
import useUserData from '../hooks/useUserData.js';

import Home from "./Home.jsx";
import NotFound from './NotFound.jsx'
import Entry from './Entry.jsx'

export default function App() {
  const userData = useUserData()

  return (
    <UserContext.Provider value={userData}>
      <div className="App">
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path='/login' element={<Entry />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
}