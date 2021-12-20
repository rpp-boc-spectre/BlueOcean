const express = require('express');
const path = require('path');
const { getUrls } = require('./controllers/audio');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const { Blob, Buffer } = require('buffer');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.listen(process.env.PORT || port, () => {
  console.log(`Listening on port ${process.env.PORT || port}`);
});

app.get('/audio', async (req, res) => {
  try {
    let urls = await getUrls();
    res.status(200).json(urls);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.post('/audioUrls', async (req, res) => {
  let blob = req.body;
  // console.log('blob',blob)
  console.log('dir', typeof __dirname);
  const content = Buffer.from([blob], 'base64');
  fs.writeFile(
    path.join(__dirname, './audioFiles/blob.txt'),
    content,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('writtenFile', content);
    }
  );

  try {
    var process = new ffmpeg(path.join(__dirname, './audioFiles/blob.txt'));
    process.then(
      function (audio) {
        audio.fnExtractSoundToMP3(
          path.join(__dirname, './audioFiles/newFile.mp3'),
          function (error, file) {
            if (!error) {
              console.log('AudioFile:' + file);
              res.status(200).json({ message: file });
            }
          }
        );
      },
      function (err) {
        console.log('error', err);
      }
    );
  } catch (error) {
    console.log('ERROR', error.code, error.content);
  }
});
