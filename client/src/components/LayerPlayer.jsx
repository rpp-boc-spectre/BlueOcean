import React, { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';

import LayerEditor from './LayerEditor.jsx';


export default function LayerPlayer({ layers }) {
  const [allLayers, setAllLayers] = useState([]);
  const allLayersPlayState = useRef('');


  const playAllLayers = async () => {
    await Tone.start();
    allLayers.forEach((layer, i) => {
      console.log('play all: ', layer)
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
    console.log('click')
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
  }

  useEffect(() => {
    // for right meow, calling this function instead of fetching data
    layerMaker();
  }, [layers]);

  const layerMaker = async() => {

    let layerEditorComponents = layers.map((layer, index) => {
      console.log(layer)
      var newPlayer = new Tone.Player(layer.url)
      const pitchShift = new Tone.PitchShift(layer?.pitch || 0).toDestination();
      const volume = new Tone.Volume(layer?.volume || -5)
      volume.connect(pitchShift)
      newPlayer.connect(volume)

      // do not sync players here in order to maintain individual player control
      return (
          <LayerEditor
            key={index}
            id={index}
            layerPlayer={newPlayer}
            pitchShift={pitchShift}
            pitch={layer.pitch}
            layerVolume={volume}
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
      <button onClick={handleSaveClick}>Save Changes</button>
      {/*alllayersfromstate*/}
      {allLayers}
    </div>
  );
}

