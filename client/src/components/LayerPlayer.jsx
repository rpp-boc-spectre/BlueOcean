import React, { useEffect, useState, useRef } from 'react';
import { db, storage } from '../lib/firebase'
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import * as Tone from 'tone';

import LayerEditor from './LayerEditor.jsx';


export default function LayerPlayer(props) {
  const [allLayers, setAllLayers] = useState([]);
  const allLayersPlayState = useRef('');
  const [trackId, setTrackId] = useState('WhkfV0geDWbzIUTIJdUT')

  const playAllLayers = async () => {
    await Tone.start();
    allLayers.forEach((layer, i) => {
      console.log('play all: ', layer.props)
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

  const layerMaker = async() => {
    // const layers = [
    //   temporaryUserLayer1,
    //   temporaryUserLayer2,
    //   temporaryUserLayer3,
    //   temporaryUserLayer4,
    // ];
    // making sure it works with audio recorded from my mic
    // const userMp3 = [testingMp3, testingMp3, testingMp3, testingMp3];

    let docRef = doc(db, 'tracks', trackId)
    const docSnap = await getDoc(docRef)
    const docData = docSnap.data()

    let urls = []
    for (var track of docData.tracks) {
      let url = await getDownloadURL(ref(storage, `audio/${track.parent}/${track.filename}`))
      urls.push(url)
    }

    let layers = docData.tracks.map((track, index) => {
      return {...track, url: urls[index]}
    })

    let layerEditorComponents = layers.map((layer, index) => {
      var pitchShift = new Tone.PitchShift(layer.pitch).toDestination();
      var newPlayer = new Tone.Player(layer.url).connect(pitchShift);
      newPlayer.volume.value = layer.volume
      // newPlayer.playbackRate

      // do not sync players here in order to maintain individual player control
      return (
          <LayerEditor
            key={index}
            id={index}
            layerPlayer={newPlayer}
            pitchShift={pitchShift}
            pitch={layer.pitch}
          />
      );
    });

    // save created layers in state so that we can sync them to play all together in playAllLayers()
    setAllLayers((prevLayers) => layerEditorComponents);
  };

  return (
    <div>
      <h3>Layer Player Component</h3>
      <button onClick={playAllLayers}>Play All Layers</button>
      <button onClick={stopAllLayers}>Stop All Layers</button>
      <button onClick={pauseResumeAllLayers}>Pause/Resume</button>
      {/*alllayersfromstate*/}
      {allLayers}
    </div>
  );
}

