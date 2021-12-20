import React from 'react';
import ReactDOM from 'react-dom';
import MusicPlayer from './components/MusicPlayer';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VerboseRecorder from './components/verboseRecorder';
import LessVerboseRecorder from './components/lessVerboseRecorder/LessVerboseRecorder';
import Synth from './components/makeSoundPlayground/synth';
import RecorderTone from './components/recorderTone/recorderTone';
import Mp3Recorder from './components/mp3recorder/Mp3Recorder';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>I'm rendered from React!</h1>
        {/* <Mp3Recorder/> */}
        {/* <MusicPlayer />
        <LessVerboseRecorder/>
        <Synth/> */}
        {/* <RecorderTone/> */}
        <LessVerboseRecorder/>
        {/* <VerboseRecorder/> */}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

// import React, { useState, useRef, useEffect } from "react";
// import ReactDOM from "react-dom";
// import { Sampler } from "tone";
// import A1 from "/Users/josephhaines/Desktop/A1.mp3"

// export const App = () => {
//   const [isLoaded, setLoaded] = useState(false);
//   const sampler = useRef(null);

//   useEffect(() => {
//     sampler.current = new Sampler(
//       { A1 },
//       {
//         onload: () => {
//           setLoaded(true);
//         }
//       }
//     ).toDestination();
//   }, []);

//   const handleClick = () => sampler.current.triggerAttack("A1");

//   return (
//     <div>
//       <button disabled={!isLoaded} onClick={handleClick}>
//         start
//       </button>
//     </div>
//   );
// };

// ReactDOM.render(<App />, document.getElementById("root"));