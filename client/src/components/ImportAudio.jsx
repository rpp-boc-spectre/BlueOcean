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
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import toast from 'react-hot-toast';
import { getLayerUrl } from '../utils/storage.js';
import { useLayerStore } from '../context/LayerContext.js';

export default function ImportAudio({ userId, currentList, originalList, setParentLayers, close }) {
  const [layerStore, dispatch] = useLayerStore();
  const [audioLayerList, setAudioLayerList] = useState([])
  const [originalAudioLayerList, setOriginalAudioLayerList] = useState([])
  const [loading, setLoading] = useState(true)
  const [checked, setChecked] = React.useState([]);
  const [originalChecked, setOriginalChecked] = React.useState([]);
  const [checkLinks, setCheckLinks] = React.useState([]);
  const [layerMax, setLayerMax] = React.useState(4);

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
        setAudioLayerList(items);
        return items;
      }).then((items) => {
        let links = [];
        originalList.forEach((itemRef, index) => {
          if (currentList.map(layer => layer.fileName).includes(itemRef.fileName)) {
            setOriginalChecked((prev) => [...prev, index])
          }
          items.forEach((layer, innerIndex) => {
            const match = itemRef.fileName === layer.fileName && itemRef.parent === layer.parent;
            if (match) {
              links.push([index, innerIndex]);
            }
          })
        });
        setCheckLinks(links);
        setOriginalAudioLayerList(originalList);
        setLoading(false)
      }).catch((error) => {
        console.debug(error);
        toast.custom(<Alert variant='filled' severity='error'>There was an error getting files.</Alert>)
        setLoading(false)
      });
  }, []);

  const handleOriginalToggle = (value) => (followThrough = true) => {
    const currentIndex = originalChecked.indexOf(value);
    const newChecked = [...originalChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setOriginalChecked(newChecked);
    if (followThrough) {
      checkLinks.filter(link => value === link[0]).forEach(link => {
        console.log(link);
        handleToggle(link[1])(false);
      }
      )
    };
  };

  const handleToggle = (value) => (followThrough = true) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    if (followThrough) {
      checkLinks.filter(link => value === link[1]).forEach(link => {
        handleOriginalToggle(link[0])(false);
      }
      )
    };
  };

  const handleSubmit = () => {
    let submitList = []

    checked.forEach((value) => {
      submitList.push(audioLayerList[value])
    })
    originalChecked.forEach((value) => {
      if (submitList.filter(layer => layer.url === originalAudioLayerList[value].url).length === 0) {
        submitList.push(originalAudioLayerList[value]);
      } else {
        console.debug('Ignored original layer ' + originalAudioLayerList[value].fileName);
      }
    })
    if (layerStore.player) {
      layerStore.player.reload(submitList)
    }
    setParentLayers(submitList)
    toast.custom(<Alert variant='filled' severity='success' color='primary'>{`Imported ${checked.length} item(s)`}</Alert>)
    close()
  }

  useEffect(() => {
    setLayerMax(4 + originalChecked.length);
  }, [originalChecked]);

  return (
    <>
      {loading ?
        <p>loading...</p>
        :
        audioLayerList ?
          <>
            <List sx={{
              width: { xs: '80%', sm: '90%', md:'100%'},
              maxWidth: 360,
              bgcolor: 'background.paper'
            }}>
              {originalAudioLayerList ? <Typography sx={{ml: 1}}><b>Original Layers</b></Typography> : <></>}
              {originalAudioLayerList.map((item, index) => {
                const labelId = `checkbox-list-label-${index}`;
                const disabled = originalChecked.length + checked.length >= layerMax && originalChecked.indexOf(index) === -1
                return (
                  <ListItem key={index}>
                    <ListItemButton role={undefined} onClick={handleOriginalToggle(index)} dense disabled={disabled}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={originalChecked.indexOf(index) !== -1}
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
              {originalAudioLayerList && audioLayerList ? <Divider /> : <></>}
              {audioLayerList ? <Typography sx={{mt: 1, ml: 1}}><b>Personal Layers</b></Typography> : <></>}
              {audioLayerList.map((item, index) => {
                const labelId = `checkbox-list-label-${index}`;
                const disabled = originalChecked.length + checked.length >= layerMax && checked.indexOf(index) === -1
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
            <Button
              variant={'outlined'}
              onClick={handleSubmit}
              sx={{
                color: 'grey.50',
                bgcolor: 'primary.light',
                ':hover': { bgcolor: 'primary.dark' },
                mb: 1,
                width: { xs: '100%', sm: '100%', md: '100%' }
              }}
            >
              Import
            </Button>
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