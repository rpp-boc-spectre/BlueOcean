import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export default function useUserData() {
  let [user, userLoading, error ] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false)

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

  // useEffect(() => {
  //   if (userLoading && !loading) {
  //     setLoading(true)
  //   }

  //   if (!userLoading && loading) {
  //     setLoading(false)
  //   }
  // }, [userLoading])

  return { user, username, loading };
}