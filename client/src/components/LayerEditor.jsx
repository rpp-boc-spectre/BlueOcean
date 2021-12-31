import { PlaylistRemoveTwoTone } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function LayerEditor(props) {
  const player = props.layerPlayer;
  const [duration, setDuration] = useState(false);
  const [pitchSliderValue, setPitchSliderValue] = useState(props.pitch);
  const [volumeSliderValue,setVolumeSliderValue] = useState(props.volume)
  const pitchShift = props.pitchShift;
  const layerVolume = props.layerVolume

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
      // player.stop()
      player.sync().start();
      Tone.Transport.start();
    } catch (error) {
      console.log('Error Playing Layer', error);
    }
  };
  const stopLayer = async () => {
  await  player.unsync().stop()
  //  NOTE: Do not call Tone.Transport.stop() or ALL audio will stop

  //may or may not be useful , gets the current players position on
  // tranport timeline
   console.log("player!",player._state._timeline)
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
    var output = document.getElementById('volume'+ props.id);
    output.innerHTML = volumeSliderInputValue;
    setVolumeSliderValue(volumeSliderInputValue);
    // set the pitch to be the number we get from the range input

    layerVolume.volume.value = volumeSliderInputValue;

  };

  return (
    <div className='layerEditor' id={props.id + 'layer'}>
      <h3>Layer Editor Component</h3>
      <button onClick={playLayer}>Play Layer {props.id}</button>
      <button onClick={stopLayer}>Stop Layer {props.id}</button>

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
          <span id={'volume'+props.id} value={volumeSliderValue}>
            {volumeSliderValue}
          </span>
        </p>
      </div>
    </div>
  );
}
