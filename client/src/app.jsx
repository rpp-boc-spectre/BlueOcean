import React,{useState,useRef,useEffect} from 'react';
import ReactDOM from 'react-dom';
import MusicPlayer from './components/MusicPlayer';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VerboseRecorder from './components/verboseRecorder';
import LessVerboseRecorder from './components/lessVerboseRecorder/LessVerboseRecorder';
// import lamejs from 'node-lame'
import RecorderTone from './components/recorderTone/recorderTone';
import Mp3Recorder from './components/mp3recorder/Mp3Recorder';
import A1 from '../src/A1MP3.mp3'
import MP3RecorderEncoder from './components/mp3recorder/MP3RecorderEncoder';


import LayerPlayer from './components/LayerPlayer/LayerPlayer';

class App extends React.Component {
  constructor(props) {
    super(props);


  }


  render() {
    return (
      <div>
        <h1>I'm rendered from React!</h1>

      <LayerPlayer/>
      <RecorderTone/>
      <LessVerboseRecorder/>
      <MP3RecorderEncoder/>
      <br></br>
      <br></br>
      <br></br>

      <MusicPlayer/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));


// import { Sampler } from "tone";

// const App = () => {
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