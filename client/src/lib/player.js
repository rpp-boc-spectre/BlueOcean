import * as Tone from 'tone';
import Layer from './layer.js'

export class Player {
  constructor(layersData, trackId, metaData) {
    this.layers = []
    this.trackId = trackId
    this.metaData = metaData
    this.isPlaying = false

    for (var layer of layersData) {
      const newLayer = new Layer({ ...layer, id: index, layerData: layer })
      newLayer.connect()
      this.layers.push(newLayer)
    }
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
  }

  pause() {
    if (this.isPlaying) {
      Tone.Transport.pause();
    } else {
      Tone.Transport.start();
    }
    this.isPlaying = !this.isPlaying
  }
}