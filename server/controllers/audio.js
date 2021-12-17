const { storage } = require('../../lib/firebase')
const { getDownloadURL, ref } = require('firebase/storage')

module.exports.getUrls = function getUrls() {
  return new Promise(async (resolve, reject) => {
    try {
      let urls = []
      let baseUrl = 'audio/HVA5M5IcFWT5IliCKV4212EMw4o1/';
      let fileNames = ['Bassline1.mp3', 'Bassline2.mp3', 'DobroGuitar1.mp3', 'DobroGuitar1.mp3','DobroGuitar1.mp3', 'Organ1.mp3', 'Organ2.mp3', 'beat1.mp3', 'beat2.mp3']
      for (var file of fileNames) {
        let mp3Ref = ref(storage, baseUrl + file);
        let url = await getDownloadURL(mp3Ref)
        urls.push(url)
      }
      resolve(urls)
    } catch (error) {
      reject(error)
    }
  })
}