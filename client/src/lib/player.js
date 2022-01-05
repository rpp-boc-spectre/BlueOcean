import * as Tone from 'tone';

export class Layer {
  constructor({ url, volume, pitch, id, layerData }) {
    this.id = id;
    this.url = url;
    this.player = new Tone.Player(this.url);
    this.volume = new Tone.Volume(volume || -5);
    this.pitchShift = new Tone.PitchShift(pitch || 0);
    this.waveform = new Tone.Waveform();
    this.solo = new Tone.Solo().toDestination();
    this.layerData = layerData;
    this.name = getLayerName(this.layerData);

    this.trimFromStart = this.trimFromStart || 0;
    this._pitch = this.pitchShift.pitch;
    this._mute = false;
    this._solo = false;
    this._volume = this.volume.volume.value;
  }

  connect() {
    this.player.connect(this.volume);
    this.player.connect(this.waveform);
    this.volume.connect(this.pitchShift);
    this.pitchShift.connect(this.solo);
  }

  stop() {
    this.player.unsync();
    this.player.stop();
  }

  start() {
    this.player.sync().stop();
    this.player.sync().start();
  }

  toggleMute() {
    this.player.mute = !this.player.mute;
    this._mute = this.player.mute;
    console.log('sneaky click', this._mute);
  }

  toggleSolo() {
    this.solo.solo = !this.solo.solo;
    this._solo = this.solo.solo;
  }

  changePitchValue(newValue) {
    this.pitchShift.pitch = newValue;
  }

  changeVolumeValue(newValue) {
    this.volume.volume.value = newValue;
  }

  duration() {
    return this.player._buffer.duration;
  }

  getLayerData() {
    return {
      pitch: this.pitchShift.pitch,
      volume: this.volume.volume.value,
      url: this.url,
      fileName: this.layerData.fileName,
      layerName: this.name,
      parent: this.layerData.parent,
      start: 0,
      end: 0,
      duration: 0,
    };
  }
}

function getLayerName(layerData) {
  if (layerData.fileName.includes('.webm')) {
    return layerData.fileName.split('.webm')[0];
  }

  if (layerData.fileName.includes('.mp3')) {
    return layerData.fileName.split('.mp3')[0];
  }

  if (layerData?.layerName) {
    return layerData.layerName;
  }

  return 'unknown';
}
