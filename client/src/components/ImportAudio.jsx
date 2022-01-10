import React, { useState, useEffect } from 'react';
import { storage } from '../lib/firebase.js';
import { ref, listAll } from "firebase/storage";
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useSnackbar } from 'material-ui-snackbar-provider';
import { getLayerUrl } from '../utils/storage.js';
import { useLayerStore } from '../context/LayerContext.js';

export default function ImportAudio({ userId, currentList, setParentLayers, close }) {
  const [layerStore, dispatch] = useLayerStore();
  const [audioLayerList, setAudioLayerList] = useState([])
  const [loading, setLoading] = useState(true)
  const [checked, setChecked] = React.useState([]);
  const snackbar = useSnackbar();

  useEffect(() => {
    const listRef = ref(storage, `audio/${userId}`);
    listAll(listRef)
      .then((res) => {
        let items = res.items.map((itemRef, index) => {
          // All the items under listRef.
          let layer = {}

          layer.layerName = getLayerName(itemRef.name)
          for (var currentLayer of currentList) {
            if (currentLayer.layerName === layer.layerName) {
              setChecked((prev) => [...prev, index])
            }
          }
          getLayerUrl(itemRef)
            .then(url => {
              layer.url = url
            })

          layer.parent = userId
          layer.fileName = itemRef.name
          return layer
        });
        setAudioLayerList(items)
        setLoading(false)
      }).catch((error) => {
        snackbar.showMessage(<Alert variant='error'>There was an error getting files.</Alert>)
        setLoading(false)
      });
  }, [])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSubmit = () => {
    let submitList = []

    checked.forEach((value) => {
      submitList.push(audioLayerList[value])
    })
    if (layerStore.player) {
      layerStore.player.reload(submitList)
    }
    setParentLayers(submitList)
    snackbar.showMessage(<Alert variant='success'>{`Imported ${checked.length} item(s)`}</Alert>)
    close()
  }

  return (
    <>
      {loading ?
        <p>loading...</p>
        :
        audioLayerList ?
          <>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {audioLayerList.map((item, index) => {
                const labelId = `checkbox-list-label-${index}`;
                const disabled = checked.length >= 4 && checked.indexOf(index) === -1
                return (
                  <ListItem key={index}>
                    <ListItemButton role={undefined} onClick={handleToggle(index)} dense disabled={disabled}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(index) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={item.layerName} />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
            <Button variant={'outlined'} onClick={handleSubmit}>Import</Button>
          </>
          :
          <p>No items to show</p>
      }
    </>
  )
}

function getLayerName(name) {
  if (name.includes('.webm')) {
    return name.split('.webm')[0];
  }

  if (name.includes('.mp3')) {
    return name.split('.mp3')[0];
  }

  return 'unknown';
}