import { db } from '../lib/firebase'
import { doc, getDoc, setDoc, collection, getDocs, where, query } from 'firebase/firestore'

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

export function saveTrackData(allPlayers, userId, trackId) {
  return new Promise( async (resolve, reject) => {
    try {
      let trackData = createTrackDataObject(allPlayers, userId)
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

export function getAllTracks(userId) {
  return new Promise( async (resolve, reject) => {
    try {
      let collRef = collection(db, 'tracks')
      let q = query(collRef, where('user', '==', userId))
      const querySnapshot = await getDocs(q);
      let data =[]
      console.log(querySnapshot)
      querySnapshot.forEach((doc) => {
        console.log(doc)
        let docData = doc.data()
        docData.id = doc.id
        data.push(docData)
      })
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}


const createTrackDataObject = (players, userId) => {
  let trackData = {
    user: userId,
    layers: []
  }

  for (var playerKey in players) {
    let player = players[playerKey]

    let data = player.getLayerData()
    console.log(data)

    trackData.layers.push(data)
  }

  return trackData
}