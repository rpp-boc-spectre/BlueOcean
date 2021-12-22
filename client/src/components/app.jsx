import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./Home.jsx";
import NotFound from './NotFound.jsx';
import Editor from './Editor.jsx';

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/edit" element={<Editor />} />
      </Routes>
    </div>
  );
}