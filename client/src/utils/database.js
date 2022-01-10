import { db } from '../lib/firebase'
import { doc, getDoc, setDoc, collection, getDocs, where, query } from 'firebase/firestore'

export function getTrackData(trackId) {
  return new Promise(async (resolve, reject) => {
    try {
      let docRef = doc(db, 'tracks', trackId)
      const docSnap = await getDoc(docRef)
      const docData = docSnap.data()
      docData.id = trackId
      resolve(docData)
    } catch (error) {
      reject(error)
    }
  })
}

export function saveTrackData(player, userId, metadata) {
  return new Promise(async (resolve, reject) => {
    try {
      let trackData = player.getTrackData();
      let ref;

      if ((userId === player.owner) && player.id) {
        // console.log('update track')
        ref = doc(db, "tracks", player.id)
        trackData.meta = metadata
        await setDoc(ref, trackData)
      } else {
        // console.log('new track')
        trackData.user = userId
        trackData.meta = metadata
        console.log(trackData)
        ref = doc(collection(db, "tracks"))
        await setDoc(ref, trackData)
      }
      resolve(ref.id)
    } catch (error) {
      reject(error)
    }
  })
}

export function getAllTracks(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      let collRef = collection(db, 'tracks')
      let q = query(collRef, where('user', '==', userId))
      const querySnapshot = await getDocs(q);
      let data = []
      querySnapshot.forEach((doc) => {
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

export function getAllPublicTracks() {
  return new Promise(async (resolve, reject) => {
    try {
      let collRef = collection(db, 'tracks')
      let q = query(collRef, where('meta.public', '==', true))
      const querySnapshot = await getDocs(q);
      let data = []
      querySnapshot.forEach((doc) => {
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

const createTrackDataObject = (players, userId, metadata) => {
  let trackData = {
    user: userId,
    layers: [],
    metadata: metadata
  }

  for (var playerKey in players) {
    let player = players[playerKey]

    let data = player.getLayerData()
    console.log(data)

    trackData.layers.push(data)
  }

  return trackData
}