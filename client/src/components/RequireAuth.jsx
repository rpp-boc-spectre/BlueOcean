import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  let userData = useContext(UserContext)
  let location = useLocation();

  if (!userData.loading && (!userData?.user || !userData?.username)) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!userData.loading && (userData.user && userData.username)) {
    return children;
  }

  return(
    <>
    loading...
    </>
  )
}