import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>I'm rendered from React!</h1>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));