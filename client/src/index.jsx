import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import UserContext from './context/UserContext.js';
import useUserData from './hooks/useUserData.js';

import App from './components/app.jsx'

const userData = useUserData()

ReactDOM.render(
  <BrowserRouter>
    <UserContext.Provider value={userData}>
      <App />
    </UserContext.Provider>
  </BrowserRouter>,
  document.getElementById("root")
);