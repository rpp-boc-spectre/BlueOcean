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
    this.bufferDuration;
    this.player = new Tone.GrainPlayer(this.url);
    this.player.playbackRate = playbackRate || 1;
    this.player.detune = pitch || 0;
    this.volume = new Tone.Volume(volume || -20);
    this.waveform = new Tone.Waveform();
    this.solo = new Tone.Solo().toDestination();
    this.layerData = layerData;
    this.name = getLayerName(this.layerData);
    this.trimFromEnd = 0 || trimFromEnd
    this.trimFromStart = trimFromStart || 0;
    this.playbackRate = playbackRate || 1;
    this._pitch = pitch || 0;
    this._mute = false;
    this._solo = false;
    this._volume = this.volume.volume.value;

     if(this.trimFromEnd === Infinity || this.trimFromEnd === undefined){
       this.trimFromEnd = 0.00
     }


  }

  connect() {
    this.player.connect(this.volume);
    this.player.connect(this.waveform);
    this.waveform.connect(this.volume);
    this.volume.connect(this.solo);
  }

  stop() {
    this.player.unsync();
    this.player.stop();
  }

  compareTrim() {
    let preTrimEnd = this.duration() + this.trimFromEnd;
    let preTrimStart = this.trimFromStart;
    return preTrimEnd < preTrimStart;
  }

  start() {
    this.player.playbackRate <= 0.7
      ? (this.player.grainSize = 0.05)
      : (this.player.grainSize = 0.2);
    this.player.unsync().stop();
    let startTime = this.trimFromStart / this.player.playbackRate;
    let offsetTime = startTime;
    let endTime =
      this.duration() - Math.abs(this.trimFromEnd) / this.player.playbackRate;

    this.compareTrim()
      ? this.player.sync().start().stop()
      : this.player.sync().start(startTime, offsetTime).stop(endTime);
    this.startWaveform();
  }
  startWaveform() {
    Tone.Transport.schedule((time) => {
      Tone.Draw.schedule(() => {
        let analyser, bufferLength, dataArray;
        const canvas = document.querySelector('.visual-layer' + this.id);
        const canvasCtx = canvas.getContext('2d');

        analyser = this.waveform._analyser._analysers[0];
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const draw = () => {
          analyser.getByteTimeDomainData(dataArray);

          canvasCtx.fillStyle = '#FAE9B8';
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = '#000000';
          canvasCtx.beginPath();

          let sliceWidth = (canvas.width * 1.0) / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            let v = dataArray[i] / 128.0;
            let y = (v * canvas.height) / 2;

            if (i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          canvasCtx.lineTo(canvas.width, canvas.height / 2);
          canvasCtx.stroke();
          window.requestAnimationFrame(draw);
        };
        draw();
      }, time);
    }, '+0.005');
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
    this.trimFromEnd = newValue;
  }

  changeDetuneValue(newValue) {
    this._pitch = newValue;
    this.player.detune = newValue;
  }
  changeVolumeValue(newValue) {
    this.volume.volume.value = newValue;
  }
  changePlaybackRate(newValue) {
    this.playbackRate = Number(newValue);
    this.player.playbackRate = Number(newValue);
  }
  duration() {
    return this.player.buffer.duration / this.playbackRate;
  }

  dispose() {
    this.player.dispose();
    this.waveform.dispose();
    this.volume.dispose();
    this.solo.dispose();
  }

  getLayerData() {
    return {
      pitch: this.player.detune,
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
