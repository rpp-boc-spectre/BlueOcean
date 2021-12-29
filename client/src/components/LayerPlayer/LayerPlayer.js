import React, { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';
import axios from 'axios';
import testingMp3 from '../../testing.mp3';

const temporaryUserLayer1 =
  'https://tonejs.github.io/audio/berklee/guitar_highEstring.mp3';
const temporaryUserLayer2 =
  'https://tonejs.github.io/audio/berklee/guitar_Bstring.mp3';
const temporaryUserLayer3 =
  'https://tonejs.github.io/audio/berklee/guitar_Gstring.mp3';
const temporaryUserLayer4 =
  'https://tonejs.github.io/audio/berklee/guitar_LowEstring1.mp3';

export default function LayerPlayer(props) {
  const [allLayers, setAllLayers] = useState([]);
  const allLayersPlayState = useRef('');

  const playAllLayers = async () => {
    await Tone.start();
    allLayers.forEach((layer, i) => {
      layer.props.layerPlayer.sync().start();
    });
    await Tone.loaded();
    allLayersPlayState.current = 'started';
    Tone.Transport.start();
  };

  const stopAllLayers = () => {
    Tone.Transport.stop();
    allLayers.forEach((layer, i) => {
      layer.props.layerPlayer.unsync();
    });
  };

  const pauseResumeAllLayers = () => {
    if (allLayersPlayState.current === 'started') {
      Tone.Transport.pause();
      allLayersPlayState.current = 'stopped';
    } else if (allLayersPlayState.current === 'stopped') {
      Tone.Transport.start();
      allLayersPlayState.current = 'started';
    }
  };

  useEffect(() => {
    // for right meow, calling this function instead of fetching data

    layerMaker();
  }, []);

  const layerMaker = () => {
    const layers = [
      temporaryUserLayer1,
      temporaryUserLayer2,
      temporaryUserLayer3,
      temporaryUserLayer4,
    ];
    // making sure it works with audio recorded from my mic
    const userMp3 = [testingMp3, testingMp3, testingMp3, testingMp3];

    let layerEditorComponents = layers.map((layer, index) => {
      var pitchShift = new Tone.PitchShift().toDestination();
      var newPlayer = new Tone.Player(layer).connect(pitchShift);
      // newPlayer.playbackRate

      // do not sync players here in order to maintain individual player control
      return (
        <LayerEditor
          key={index}
          id={index}
          layerPlayer={newPlayer}
          pitchShift={pitchShift}
        />
      );
    });

    // save created layers in state so that we can sync them to play all together in playAllLayers()
    setAllLayers((prevLayers) => layerEditorComponents);
  };

  return (
    <div>
      <button onClick={playAllLayers}>Play All Layers</button>
      <button onClick={stopAllLayers}>Stop All Layers</button>
      <button onClick={pauseResumeAllLayers}>Pause/Resume</button>
      {/*alllayersfromstate*/}
      {allLayers}
    </div>
  );
}

const LayerEditor = (props) => {
  const player = props.layerPlayer;
  const [duration, setDuration] = useState(false);
  const [sliderValue, setSliderValue] = useState('0');
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
      <button onClick={playLayer}>Play Layer {props.id}</button>

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

