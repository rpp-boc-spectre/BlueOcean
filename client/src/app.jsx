import React from 'react';
import ReactDOM from 'react-dom';
import MusicPlayer from './components/MusicPlayer';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VerboseRecorder from './components/verboseRecorder';
import LessVerboseRecorder from './components/lessVerboseRecorder/LessVerboseRecorder';
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>I'm rendered from React!</h1>
        <MusicPlayer />
        <LessVerboseRecorder/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));