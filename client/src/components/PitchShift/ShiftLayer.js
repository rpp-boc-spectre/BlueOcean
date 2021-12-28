import React, { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';
import axios from 'axios';
import testingMp3 from '../../testing.mp3';

const ShiftLayer = function (props) {
  const [isReady, setIsReady] = useState(false);
  const [shiftBy, setShiftBy] = useState(0);
  const [layer1Player, setLayer1Player] = useState(null);
  const [layer1Shifter, setLayer1Shifter] = useState(null);
  const layer1 = useRef(0);
  const shift = useRef(null);


  // this also works, but it takes a while to finish. if you stop and start again before its done, it will increase the volume.
  const temporaryUserLayer =
    'https://tonejs.github.io/audio/berklee/guitar_highEstring.mp3';

  const startLayer1 = async () => {
    if (!layer1Player) {
      await Tone.start();
      const userLayer1 = new Tone.Player(testingMp3);
      let pitchShift = new Tone.PitchShift(layer1.current).toDestination();

      userLayer1.connect(pitchShift);

      await Tone.loaded();
      shift.current = pitchShift;
      setLayer1Player(userLayer1);

      userLayer1.sync().start();
      // userLayer1.loop = false;
      Tone.Transport.start();
    } else {
      if (shift.current) {
        layer1Player.disconnect(shift.current);
        shift.current = null;
      }
      let pitchShift = new Tone.PitchShift(layer1.current).toDestination();
      shift.current = pitchShift;
      layer1Player.connect(pitchShift);
      layer1Player.sync().start();
      // layer1Player.loop = false;
      Tone.Transport.start();
    }
  };

  const stopLayer1 = () => {
    Tone.Transport.stop();
    // userLayer1.stop()
  };

  const pauseResume = () => {
    if (layer1Player.state == 'started') {
      // Use the Tone.Transport to pause audio
      Tone.Transport.pause();
    } else if (layer1Player.state == 'stopped') {
      // Use the Tone.Transport to start again
      Tone.Transport.start();
    }
  };


  const  playAll = (player) =>{

    // passPlayers(player)

  }
  return (
    <div>
      <div>
        <h2>Layer 'props Layer' </h2>
        <button onClick={startLayer1}>Play!</button>
        <button onClick={stopLayer1}>Stop!</button>
        <button onClick={pauseResume}>Pause!</button>
        <div>
          <h2>Select Pitch</h2>
          <button onClick={() => (layer1.current = 1)}>Minor 2nd</button>
          <button onClick={() => (layer1.current = 2)}>Major 2nd</button>
          <button onClick={() => (layer1.current = 3)}>Minor 3rd</button>
          <button onClick={() => (layer1.current = 4)}>Major3rd</button>
          <button onClick={() => (layer1.current = 5)}>Perfect 4th</button>
          <button onClick={() => (layer1.current = 6)}> Augmented 4th/ Diminished 5th</button>
          <button onClick={() => (layer1.current = 7)}> Perfect 5th</button>
          <button onClick={() => (layer1.current = 8)}> Minor 6th</button>
          <button onClick={() => (layer1.current = 9)}> Major 6th</button>
          <button onClick={() => (layer1.current = 10)}> Minor 7th</button>
          <button onClick={() => (layer1.current = 11)}>Major 7th</button>
          <button onClick={() => (layer1.current = 12)}>Octave</button>
          <button
            onClick={() => {
              layer1.current = 0;
            }}>
            {' '}
            Reset
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShiftLayer;

/*
  const playAll = async () => {
    await Tone.start();

    allUrls.forEach((url, index) => {
      let player = new Tone.Player({ url: url });

      let pitchShift = new Tone.PitchShift(layer1.current);
      player.chain(pitchShift, Tone.Destination);
      // player.connect(pitchShift)
      // pitchShift.connect(player).toDestination()
      player.sync().start();
    });

    await Tone.loaded();
    console.log('ready!', shiftBy);
    Tone.Transport.start();
  };

  useEffect(() => {

    globalPlayer.current = allUrls.forEach((url, index) => {
      let player = new Tone.Player({ url: url });
      let pitchShift = new Tone.PitchShift(shiftBy).toDestination();
      player.connect(pitchShift);
      player.sync().start();
    });


    Tone.loaded().then(() =>{
        console.log('Ready')
    }).catch((err) =>{console.log(err)})
    return () => {
        console.log('player',globalPlayer.current)
    }
  });

 const playB = async () => {
    // await Tone.start()
    const playBString = new Tone.Player(BString).toDestination();

    // playBString.start()
    return new Tone.Player(BString);
  };
  const playOne = async () => {
    await Tone.start();

    const gong = new Tone.Player(url).toDestination();

    await Tone.loaded();
    gong.start();
  };

*/
