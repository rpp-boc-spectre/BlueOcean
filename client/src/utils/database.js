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

export function saveTrackData(allPlayers, trackId) {
  return new Promise( async (resolve, reject) => {
    try {
      let trackData = createTrackDataObject(allPlayers)
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
      console.log(userId)
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


const createTrackDataObject = (players) => {
  let trackData = {
    user: userId,
    layers: []
  }

  for (var playerKey in players) {
    let player = players[playerKey]

    function getLayerName(layerData) {
      if (layerData?.layerName) {
        return layerName
      }

      if (layerData.fileName.includes('.webm')) {
        return layerData.fileName.split('.webm')[0]
      }

      if (layerData.fileName.includes('.mp3')) {
        return layerData.fileName.split('.mp3')[0]
      }

      return 'unknown'
    }

    let data = {
      start: 0,
      end: 0,
      duration: 0,
      pitch: player.pitchShift._pitch,
      volume: player.layerVolume.volume.value,
      fileName: player.layerData.fileName,
      parent: player.layerData.parent,
      layerName: getLayerName(player.layerData)
    }

    trackData.layers.push(data)
  }

  return trackData
}