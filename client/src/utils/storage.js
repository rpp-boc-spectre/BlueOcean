import { storage } from '../lib/firebase'
import { ref, listAll, getDownloadURL } from 'firebase/storage'

export function listUserLayers(userId) {
  return new Promise(async (resolve, reject) => {
    const listRef = ref(storage, `audio/${userId}`);
    try {
      let res = await listAll(listRef)
      resolve(res.items)
    } catch(error) {
      reject(error)
    }
  })
}

export function getLayerUrl(storageRef){
  let ref = storageRef
  if (typeof storageRef === 'string') {
    ref = ref(storage, storageRef)
  }
  return new Promise(async (resolve, reject) => {
    try {
      let url = await getDownloadURL(ref)
      resolve(url)
    } catch (error) {
      reject(error)
    }
  })
}

export function getTrackUrls(track) {
  return new Promise(async (resolve, reject) => {
    try {
      for (var layer in track.layers) {
        console.log(layer)
        let layerRef = ref(storage, `audio/${track.layers[layer].parent}/${track.layers[layer].fileName}`)
        let url = await getDownloadURL(layerRef)
        track.layers[layer].url = url
        resolve(track)
      }
    } catch (error) {
      reject(error)
    }
  })
}