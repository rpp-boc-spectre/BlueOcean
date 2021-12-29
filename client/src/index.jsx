import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import UserContext from './context/UserContext.js';
import useUserData from './hooks/useUserData.js';

import App from './components/app.jsx'



ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);