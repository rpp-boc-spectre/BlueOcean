import { PlaylistRemoveTwoTone } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function LayerEditor(props) {
  const player = props.layerPlayer;

  console.log('sdfs', props.layerPlayer.mute);

  // const [layerPlayer,setLayerPlayer] = useState()
  const [isMuted, setIsMuted] = useState(props.layerPlayer.mute);
  const [duration, setDuration] = useState(false);
  const [pitchSliderValue, setPitchSliderValue] = useState(props.pitch);
  const [volumeSliderValue, setVolumeSliderValue] = useState(props.volume);
  const pitchShift = props.pitchShift;
  const layerVolume = props.layerVolume;
  const test = Tone.Transport;

  //  console.log('tran',test)
  // put page on mousedown listener to get the duration of tracks then immediatly remove it after setting each tracks duration.
  useEffect(() => {
    const mouse = async () => {
      await Tone.start();
      setDuration(player._buffer.duration);
    };

    if (!duration) {
      document.documentElement.addEventListener('mousedown', mouse);
    }
    return () => {
      document.documentElement.removeEventListener('mousedown', mouse);
    };
  }, [duration]);
  const playLayer = async () => {
    try {
      await Tone.start();
      await Tone.loaded();
      player.sync().start();
      Tone.Transport.start();
    } catch (error) {
      console.log('Error Playing Layer', error);
    }
  };
  const stopLayer = async () => {
    //may or may not be useful , gets the current players position on
    // tranport timeline
    //  console.log("player!",player._state._timeline)
    console.log('player', player.get());
    await player.unsync().stop();
    //  NOTE: Do not call Tone.Transport.stop() or ALL audio will stop
  };

  const changePitchValue = (e) => {
    var rangeInputValue = e.target.value;
    var output = document.getElementById(props.id);
    output.innerHTML = rangeInputValue;
    setPitchSliderValue(rangeInputValue);
    // set the pitch to be the number we get from the range input
    pitchShift.pitch = rangeInputValue;
  };
  const changeVolumeValue = (e) => {
    var volumeSliderInputValue = e.target.value;
    var output = document.getElementById('volume' + props.id);
    output.innerHTML = volumeSliderInputValue;
    setVolumeSliderValue(volumeSliderInputValue);
    // set the volume to be the number we get from the range input
    layerVolume.volume.value = volumeSliderInputValue;
  };

  const muteLayer = () => {
    var muted = document.getElementById('mute' + props.id);

    isMuted
      ? (muted.innerHTML = 'Mute Layer')
      : (muted.innerHTML = 'Unmute Layer');

    setIsMuted(!isMuted);
    player.mute = !isMuted;
  };

  return (
    <div className='layerEditor' id={props.id + 'layer'}>
      <h3>Layer Editor Component</h3>
      <button onClick={playLayer} disabled={isMuted === true}>
        Play Layer {props.id}
      </button>
      <button onClick={stopLayer}>Stop Layer {props.id}</button>
      <button onClick={muteLayer} value='' id={'mute' + props.id}>
        Mute Layer {props.id}
      </button>

      <div className='slidecontainer'>
        <input
          type='range'
          min='0'
          max='12'
          value={pitchSliderValue}
          onInput={changePitchValue}
          className='slider'
          id='myRange'
        />
        <p>
          Pitch:{' '}
          <span id={props.id} value={pitchSliderValue}>
            {pitchSliderValue}
          </span>
        </p>
      </div>
      <div className='volumeSlideContainer'>
        <input
          type='range'
          min='-20'
          max='20'
          value={volumeSliderValue}
          onInput={changeVolumeValue}
          className='slider'
          id='myRange'
        />
        <p>
          Volume:{' '}
          <span id={'volume' + props.id} value={volumeSliderValue}>
            {volumeSliderValue}
          </span>
        </p>
      </div>
    </div>
  );
}
