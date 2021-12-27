import React, { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';
import axios from 'axios';

const PitchShift = function (props) {
  const [isReady, setIsReady] = useState(false);
  const [shiftBy, setShiftBy] = useState(0);
  const globalPlayer = useRef(0);
  const [layer1Player,setLayer1Player] =useState(null)
  const layer1 = useRef(null);
  const layer2 = useRef(null);
  const layer3 = useRef(null);
  const layer4 = useRef(null);

  const highEString =
    'https://tonejs.github.io/audio/berklee/guitar_highEstring.mp3';
  const lowEString =
    'https://tonejs.github.io/audio/berklee/guitar_LowEstring1.mp3';
  const DString = 'https://tonejs.github.io/audio/berklee/guitar_Dstring.mp3';
  const AString = 'https://tonejs.github.io/audio/berklee/guitar_Astring.mp3';
  const GString = 'https://tonejs.github.io/audio/berklee/guitar_Gstring.mp3';
  const BString = 'https://tonejs.github.io/audio/berklee/guitar_Bstring.mp3';

  const allUrls = [GString, BString];

  const startAudio = async () => {
    await Tone.start();

    Tone.Transport.start();
  };
  const handleStopClick = () => {
    Tone.Transport.stop();
  };

  const startLayer1 = async () => {
    await Tone.start();
    const UserLayer1 = new Tone.Player(GString);
    let pitchShift = new Tone.PitchShift(layer1.current).toDestination();
    UserLayer1.connect(pitchShift);
    await Tone.loaded();
    setLayer1Player(UserLayer1)
    UserLayer1.start();
  };

  const stopLayer1 = () =>{

   layer1Player.stop()
  }
  const playLayer2 = async () => {
    await Tone.start();
    const UserLayer2 = new Tone.Player(BString);
    let pitchShift = new Tone.PitchShift(layer2.current).toDestination();

    UserLayer2.connect(pitchShift);
    await Tone.loaded();
    UserLayer2.start();
  };

  const pitchShifter = async () => {
    await Tone.start();

    // let trackToShift = playB()
    let trackToShift = await playB();
    let pitchShift = new Tone.PitchShift(layer1.current).toDestination();

    trackToShift.connect(pitchShift);
    await Tone.loaded();
    trackToShift.start();
  };

  // useEffect(() => {
  //     (async () =>{

  //         await Tone.start()
  //     })

  // })
  //   useEffect(()=>{
  //       console.log('shiftBy',shiftBy)
  //       if(!isReady || shiftBy !==0){
  //       allUrls.forEach((url,index) =>{
  //           let player = new Tone.Player({url:url}).toDestination()
  //           let pitchShift = new Tone.PitchShift(shiftBy).toDestination()
  //           player.connect(pitchShift)
  //           player.sync().start()
  //       })

  //       Tone.loaded().then(()=>{
  //           console.log('ready')
  //           setIsReady(true)
  //       })}
  //       // return () => {
  //       //     console.log()
  //       //     setIsReady(true)
  //       // }
  //   },[isReady,shiftBy])
  return (
    <div>
      {/* <h2>Pitch Shifter</h2> */}

      {/* <button onClick={playAll}>Play All!!</button> */}
      {/* <button onClick={pitchShifter}>gongy!</button> */}
      <div>
        <h2>Layer1</h2>
        <button onClick={startLayer1}>Play!</button>
        <button onClick={stopLayer1}>Stop!</button>
        <div>
          <h2>Select Pitch</h2>
          <button onClick={() => (layer1.current = 4)}>Major 3rd</button>
          <button
            onClick={() => {
              layer1.current = 7;
            }}>
            Perfect 5th
          </button>
          <button
            onClick={() => {
              layer1.current = 0;
            }}>
            {' '}
            Reset
          </button>
        </div>
      </div>
      <div>
        <h2>Layer2</h2>
        <button onClick={playLayer2}>Play!</button>
      </div>
      {/* <button onClick={playB}>B!</button> */}
      <button onClick={handleStopClick}>Stop!</button>
      <div>
        <h2>Select Pitch</h2>
        <button onClick={() => (layer2.current = 4)}>Major 3rd</button>
        <button
          onClick={() => {
            layer2.current = 7;
          }}>
          Perfect 5th
        </button>
        <button
          onClick={() => {
            layer2.current = 0;
          }}>
          {' '}
          Reset
        </button>
      </div>
    </div>
  );
};

export default PitchShift;

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
