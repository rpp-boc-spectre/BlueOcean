import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import UserContext from './context/UserContext.js';

import App from './components/app.jsx'

ReactDOM.render(
  <BrowserRouter>
    <UserContext.Provider value={{ user: null, username: null }}>
      <App />
    </UserContext.Provider>
  </BrowserRouter>,
  document.getElementById("root")
);