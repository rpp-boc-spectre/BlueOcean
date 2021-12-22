import React from 'react';
import axios from 'axios';
import MicRecorder from 'mic-recorder-to-mp3';
import {Buffer} from 'buffer'

const Mp3Recorder = new MicRecorder({ bitRate: 320 });
class Mp3Recording extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: true,
      file:''
    };
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder.start()
        .then(() => {
          this.setState({ isRecording: true });
        })
        .catch((e) => console.error(e));
    }
  };
  pause = () =>{
    Mp3Recorder.stop()
  }
  stop = async () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        const test =  new Buffer.from([blob])
        console.log('test',test)
        const file = new File(buffer, 'testing.mp3', {
          type: blob.type,
          lastModified: Date.now()
        });
        let blobBuff2 =  blob.arrayBuffer().then((buffer)=>{

          console.log("blobbuff",buffer[0])
        })


        // console.log('blobbuff',blobBuff2)
        const fileURL= URL.createObjectURL(file)
        console.log('file',fileURL,file)
        console.log('blob', blobURL,'buffer',buffer);
        this.setState({ blobURL:fileURL, isRecording: false,file:file });
        this.send(file)
      })
      .catch((e) => console.log(e));
  };
  send = (file) => {
    axios.post('/audioUrls', file).then((results) => {
      console.log('results', results);
    }).catch((error)=>{
      console.log('error',error)
    })
  };
  componentDidMount() {
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true });
      }
    );
  }

  render() {
    return (
      <div>
        <header>
          <button onClick={this.start}>
            Record
          </button>
          <button onClick={this.stop} disabled={!this.state.isRecording}>

            Stop
          </button>
          <button onClick={this.pause} disabled={!this.state.isRecording}>pause</button>
          <audio src={this.state.blobURL} controls='controls' />
        </header>

     {!this.state.isRecording &&  <a href={this.state.file} download='recorded.mp3'>Download</a>}

      </div>
    );
  }
}

export default Mp3Recording;
