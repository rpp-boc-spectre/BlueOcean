import { db } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

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