import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VerboseRecorder from './components/verboseRecorder';
import LessVerboseRecorder from './components/lessVerboseRecorder/LessVerboseRecorder';
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      // <VerboseRecorder/>
      <LessVerboseRecorder/>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));