import React, { useEffect, useState } from 'react';
// import { resolvePath } from 'react-router-dom';
import * as Tone from 'tone';

export default function Synth(props) {
    const [notes,setNotes] = useState(['C4', 'E4', 'G4', 'C5', 'E5', 'G5'])
  // const [synth,setSynth] = useState(new Tone.Synth())
  //  const [index,setIndex] = useState(0)
   console.log('notes',notes)
  var index = 0;
  const startSynth = async function () {
    // const notes = ['C4', 'E4', 'G4', 'C5', 'E5', 'G5'];

    const synth = await new Tone.Synth();

    synth.toDestination();

    // synth.triggerAttackRelease('C4', '8n');
    Tone.Transport.scheduleRepeat((time) => {
      console.log('time', time);
      repeat(time);
    }, '8n');

    function repeat(time) {
      let note = notes[index];
      console.log('note', note);
      synth.triggerAttackRelease(note, '8n', time);
      // setIndex((prevIndex)=> prevIndex++);
      if (index < notes.length-1) {
        index++;
      }else {
          index = 0
      }
    }


    Tone.Transport.start();

    setTimeout( () => {

      Tone.Transport.stop();

        index = 0
        setNotes(['C4', 'E4', 'G4', 'C5', 'E5', 'G5'])
    }, 5000);
  };

  return <div onClick={startSynth}>Hey</div>;
}
