import React, { useState, useEffect } from "react";
import * as Tone from 'tone'

export default function LayerEditor (props) {
  const player = props.layerPlayer;
  const [duration, setDuration] = useState(false);
  const [sliderValue, setSliderValue] = useState(props.pitch);
  const pitchShift = props.pitchShift;


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

      player.start();
      Tone.Transport.start();
    } catch (error) {
      console.log('Error Playing Layer', error);
    }
  };

  const changeValue = (e) => {
    var rangeInputValue = e.target.value;
    var output = document.getElementById(props.id);
    output.innerHTML = rangeInputValue;
    setSliderValue(rangeInputValue);
    // set the pitch to be the number we get from the range input
    pitchShift.pitch = rangeInputValue;
  };

  return (
    <div className='layerEditor' id={props.id + 'layer'}>
      <h3>Layer Editor Component</h3>
      <button onClick={playLayer}>Play Layer {props.layerData.layerName}</button>

      <div className='slidecontainer'>
        <input
          type='range'
          min='0'
          max='12'
          value={sliderValue}
          onInput={changeValue}
          className='slider'
          id='myRange'
        />
        <p>
          Value:{' '}
          <span id={props.id} value={sliderValue}>
            {sliderValue}
          </span>
        </p>
      </div>
    </div>
  );
};