import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth';
import Entry from "./Entry";

export default function RequireAuth({ children }) {
  let location = useLocation();
  let [user, userLoading, error] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setLoading(true)
      const ref = doc(db, 'users', user.uid)
      getDoc(ref)
        .then((doc) => {
          let userData = doc.data()
          setUsername(userData.username);
          setLoading(false)
        })
        .catch((error) => {
          console.log('useUserData ', error)
          setUsername(null)
          setLoading(false)
        })
    }
  }, [user]);

  useEffect(() => {
    if (userLoading && !user) {
      setLoading(true)
    }
    if (!userLoading && !user) {
      setLoading(false)
    }
  }, [userLoading])

  if (!loading && (!user || !username)) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!loading && (user && username)) {
    return children;
  }

  return (
    <>
      loading...
    </>
  )
}