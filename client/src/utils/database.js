import { db } from '../lib/firebase'
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore'

export function getTrackData(trackId) {
  return new Promise(async (resolve, reject) => {
    try {
      let docRef = doc(db, 'tracks', trackId)
      const docSnap = await getDoc(docRef)
      const docData = docSnap.data()
      resolve(docData)
    } catch (error) {
      reject(error)
    }
  })
}

export function saveTrackData(trackData, trackId) {
  return new Promise( async (resolve, reject) => {
    try {
      let ref;
      if (!trackId) {
        ref = doc(collection(db, "tracks"))
        await setDoc(ref, trackData)
      } else {
        ref = doc(db, "tracks", trackId)
        await setDoc(ref, trackData)
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}