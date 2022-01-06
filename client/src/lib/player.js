import * as Tone from 'tone';
import { Layer } from './layer.js'

export class Player {
  constructor(layersData, trackId, metaData) {
    this.layers = []
    this.trackId = trackId
    this.metaData = metaData
    this.isPlaying = false

    layersData.forEach((layer, index) => {
      const newLayer = new Layer({ ...layer, id: index, layerData: layer })
      newLayer.connect()
      this.layers.push(newLayer)
    })
  }

  start() {
    return new Promise(async (resolve, reject) => {
      try {
        await Tone.start();
        await Tone.loaded();

        this.layers.forEach((layer) => { layer.start() });
        Tone.Transport.seconds = 0
        Tone.Transport.start();
        this.isPlaying = true;
        resolve(this.isPlaying)
      } catch (error) {
        reject(error)
      }
    })
  }

  stop() {
    this.layers.forEach((layer) => { layer.stop() })
    Tone.Transport.stop();
    this.isPlaying = false
  }

  pause() {
    if (this.isPlaying) {
      Tone.Transport.pause();
    } else {
      Tone.Transport.start();
    }
    this.isPlaying = !this.isPlaying
  }

  reload(layers) {
    if (this.isPlaying) {
      this.stop()
    }
    this.layers.forEach((layer) => { layer.dispose() })
    layers.forEach((layer, index) => {
      const newLayer = new Layer({ ...layer, id: index, layerData: layer })
      newLayer.connect()
      this.layers.push(newLayer)
    })
  }

  dispose() {
    this.layers.forEach((layer) => {
      layer.dispose()
    })
    this.layers = []
    Tone.Transport.cancel(0)
  }
}