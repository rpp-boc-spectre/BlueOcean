import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export default function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (user) {
      const ref = doc(db, 'users', user.uid)
      getDoc(ref)
        .then((doc) => {
          setUsername(doc.data()?.username);
        })
        .catch((error) => {
          console.log('useUserData ', error)
          setUsername(null)
        })
    } else {
      setUsername(null);
    }
  }, [user]);

  return { user, username };
}