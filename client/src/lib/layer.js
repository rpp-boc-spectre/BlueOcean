import * as Tone from 'tone';

export class Layer {
  constructor({
    url,
    volume,
    pitch,
    id,
    layerData,
    trimFromStart,
    trimFromEnd,
    playbackRate,
  }) {
    this.id = id;
    this.url = url;
    this.player = new Tone.GrainPlayer(this.url);
    this.player.playbackRate = playbackRate || 1
    this.volume = new Tone.Volume(volume || 0);
    this.pitchShift = new Tone.PitchShift(pitch || 0);
    this.waveform = new Tone.Waveform();
    this.solo = new Tone.Solo().toDestination();
    this.layerData = layerData;
    this.name = getLayerName(this.layerData);
    this.trimFromEnd = trimFromEnd || Infinity;
    this.trimFromStart = trimFromStart || 0;
    this.playbackRate = playbackRate || 1;
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

  start(startTrim, offset, endTrim, playbackrate) {
    // changed this to just unsync() , no need to stop it again unless you want individual functionality
    // inwhich case put it back in.
    // havnt done offset yet, just handling case of trimming  from audio and wanting it to start at the same spot.
    // currently this is just set up to trim without cutting. This is why startTrim is called as the offset as well as the wait time
    // offset = startTrim
    // this.player.unsync();

    // this.player
    //   .sync()
    //   .start(startTrim, offset, this.duration() / playbackrate - offset)
    //   .stop(endTrim);

     offset = this.trimFromStart

     this.player.unsync()
      this.player
      .sync()
      .start(this.trimFromStart, offset, this.duration() / this.player.playbackRate - offset)
      .stop(this.trimFromEnd);

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

  changeTrimFromStart(newValue) {
    this.trimFromStart = newValue;
  }
  changeTrimFromEnd(newValue) {

    //  newvalue/ playbackrate
    this.trimFromEnd = newValue;
  }
  changePitchValue(newValue) {
    this.pitchShift.pitch = newValue;
  }

  changeVolumeValue(newValue) {
    this.volume.volume.value = newValue;
  }
  increasePlaybackRate(newValue) {
    this.playbackRate = Number(newValue);
    this.player.playbackRate = Number(newValue)
  }
  decreasePlaybackRate(newValue) {

    this.playbackRate = Number(newValue);
    this.player.playbackRate = Number(newValue)
  }
  duration() {
    return this.player.buffer.duration;
  }

  getLayerData() {
    return {
      pitch: this.pitchShift.pitch,
      volume: this.volume.volume.value,
      url: this.url,
      fileName: this.layerData.fileName,
      layerName: this.name,
      parent: this.layerData.parent,
      trimFromStart: this.trimFromStart,
      trimFromEnd: this.trimFromEnd,
      playbackRate: this.player.playbackRate,
      start: 0,
      end: 0,
      duration: this.duration(),
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
