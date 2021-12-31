import React, { useEffect, useState, useRef } from 'react';
import { db, storage } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import * as Tone from 'tone';

import LayerEditor from './LayerEditor.jsx';

export default function LayerPlayer(props) {
  const [allLayers, setAllLayers] = useState([]);
  const allLayersPlayState = useRef('');
  const [trackId, setTrackId] = useState('UtEWidzvugKK1I6CRFVU');

  const playAllLayers = async () => {
    await Tone.start();
    allLayers.forEach((layer, i) => {
      console.log('play all: ', layer);
      layer.props.layerPlayer.sync().stop();
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

  const handleSaveClick = async () => {
    console.log('click');
    // for (let i = 0; i < allLayers.length; i++) {
    //   let layer = allLayers[i]
    //   let data = {}
    //   data.pitch = layer.props.pitchShift._pitch
    //   data.volume = layer.props.layerPlayer.volume.value
    //   let layerName =

    //   let docRef = doc(db, 'tracks', trackId)
    //   await updateDoc(docRef, {

    //   })
    // }
    // allLayers.forEach((layer, index) => {

    // });
  };

  useEffect(() => {
    // for right meow, calling this function instead of fetching data

    layerMaker();
  }, []);

  const layerMaker = async () => {
    // const layers = [
    //   temporaryUserLayer1,
    //   temporaryUserLayer2,
    //   temporaryUserLayer3,
    //   temporaryUserLayer4,
    // ];
    // making sure it works with audio recorded from my mic
    // const userMp3 = [testingMp3, testingMp3, testingMp3, testingMp3];

    let docRef = doc(db, 'tracks', trackId);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();

    let urls = [];
    for (var track in docData.layers) {
      let url = await getDownloadURL(
        ref(
          storage,
          `audio/${docData.layers[track].parent}/${docData.layers[track].filename}`
        )
      );
      docData.layers[track].url = url;
    }

    // let layers = Object.keys(docData.tracks).map((track, index) => {
    //   return {...docData[track], url: urls[index]}
    // })

    let layerEditorComponents = Object.keys(docData.layers).map(
      (layerKey, index) => {
        let layer = docData.layers[layerKey];
        // var pitchShift = new Tone.PitchShift(layer.pitch).toDestination();
        // var newPlayer = new Tone.Player(layer.url).connect(pitchShift);
        // newPlayer.volume.value = layer.volume

        var newPlayer = new Tone.Player(layer);
        const pitchShift = new Tone.PitchShift(
          layer?.pitch || 0
        ).toDestination();
        const volume = new Tone.Volume(layer?.volume || -5);
        volume.connect(pitchShift);
        newPlayer.connect(volume);

        // do not sync players here in order to maintain individual player control
        return (
          <LayerEditor
            key={index}
            id={index}
            layerPlayer={newPlayer}
            pitchShift={pitchShift}
            pitch={layer.pitch}
            layerVolume={volume}
            volume={layer.volume}
          />
        );
      }
    );

    // save created layers in state so that we can sync them to play all together in playAllLayers()
    setAllLayers((prevLayers) => layerEditorComponents);
  };

  return (
    <div>
      <h3>Layer Player Component</h3>
      <button onClick={playAllLayers}>Play All Layers</button>
      <button onClick={stopAllLayers}>Stop All Layers</button>
      <button onClick={pauseResumeAllLayers}>Pause/Resume</button>
      <button onClick={handleSaveClick}>Save Changes</button>
      {/*alllayersfromstate*/}
      {allLayers}
    </div>
  );
}
