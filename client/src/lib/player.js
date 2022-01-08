import * as Tone from 'tone';
import { Layer } from './layer.js';

export class Player {
  constructor(layersData, trackData) {
    this.layers = [];
    this.meta = trackData?.meta;
    this.trackData = trackData;
    this.owner = trackData?.user;
    this.isPlaying = false;
    this.id = trackData?.id;

    layersData.forEach((layer, index) => {
      const newLayer = new Layer({ ...layer, id: index, layerData: layer });
      newLayer.connect();
      this.layers.push(newLayer);
    });
  }

  start() {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('layerStore/Player.js');
        await Tone.start();
        await Tone.loaded();
        this.layers.forEach((layer) => {
          layer.start();
        });
        Tone.Transport.seconds = 0;
        Tone.Transport.start();
        this.isPlaying = true;
        resolve(this.isPlaying);
      } catch (error) {
        reject(error);
      }
    });
  }

  stop() {
    this.layers.forEach((layer) => {
      layer.stop();
    });
    Tone.Transport.stop();
    this.isPlaying = false;
  }

  pause() {
    if (this.isPlaying) {
      Tone.Transport.pause();
    } else {
      Tone.Transport.start();
    }
    this.isPlaying = !this.isPlaying;
  }

  reload(layers) {
    console.log('reloading layers')
    if (this.isPlaying) {
      this.stop();
    }
    this.layers.forEach((layer) => {
      layer.dispose();
    });
    this.layers = []
    layers.forEach((layer, index) => {
      const newLayer = new Layer({ ...layer, id: index, layerData: layer });
      newLayer.connect();
      this.layers.push(newLayer);
    });
  }

  dispose() {
    this.layers.forEach((layer) => {
      layer.dispose();
    });
    this.layers = [];
    Tone.Transport.cancel(0);
  }

  getTrackData() {
    return {
      user: this.owner,
      layers: this.layers.map((layer) => layer.getLayerData()),
      meta: this.meta,
    };
  }

  setAllLayersPlaybackRate(newValue) {


    this.layers.forEach((layer)=>{
      layer.changePlaybackRate(newValue)

    })

  }

  setAllLayersPitch(newValue) {
    this.layers.forEach((layer) => {
      layer.changeDetuneValue(newValue);
    });
  }

  setAllLayersVolume(newValue) {
    this.layers.forEach((layer) => {
      layer.changeVolumeValue(newValue);
    });
  }

  setAllLayersGrainSize() {}

  setAllLayersReverse() {}
}
