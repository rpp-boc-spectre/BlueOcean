import { storage } from '../lib/firebase'
import { ref, listAll, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

export function listUserLayers(userId) {
  return new Promise(async (resolve, reject) => {
    const listRef = ref(storage, `audio/${userId}`);
    try {
      let res = await listAll(listRef)
      resolve(res.items)
    } catch (error) {
      reject(error)
    }
  })
}

export function getLayerUrl(storageRef) {
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
      }
      resolve(track)
    } catch (error) {
      reject(error)
    }
  })
}

export function uploadFile(file, userId) {
  return new Promise(async (resolve, reject) => {
    const storageRef = ref(storage, `audio/${userId}/${file.name}`)
    let uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(error)
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL)
        });
      }
    );
  })
}