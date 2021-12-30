const express = require('express');
const path = require('path');
const { getUrls } = require('./controllers/audio');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const { Blob, Buffer } = require('buffer');
const { Console } = require('console');
const app = express();
const port = 3000;
const NodeID3 = require('node-id3')
const Lame = require("node-lame").Lame;
const multer = require('multer')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// const mp3Test = require('../client/src/testing.mp3')


app.use(express.static(path.resolve(__dirname, '../client/dist')));
var upload = multer({ dest: __dirname + '/public/uploads/' });
var type = upload.single('upl');

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
  // let blob = req.body.blobs;
  console.log('blob',req.body)
  const blob = req.body.blob
  // const tags = req.body.tags
  // console.log('dir',path.join(__dirname,'./audioFiles/blob.txt'));
  // const filebuffer = Buffer.from([blob]);

//   const tags = {
//     title: "Tomorrow!!!!!",
//     artist: "Kevin Penkin",
//     album: "TVアニメ「メイドインアビス」オリジナルサウンドトラック",
//     APIC: "./example/mia_cover.jpg",
//     TRCK: "27",
//     length:req.body.length.toString()
// }

// const tags = {
//   title:'testing Track',
//   artist:'testyTesterosa',
//   length:req.body.length.toString()
// }
// const success =  NodeID3.write(tags, filebuffer)


// const taggedFile = NodeID3.read(success)


// console.log('tagged',taggedFile)
// needs error handling
// not sending back correct format. need to research how to send blob back.
// res.send({filebuffer})

});


//poor attempt at ffmpeg
  // fs.writeFile(
  //   path.join(__dirname, './audioFiles/blob.txt'),
  //   content,
  //   (err) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }
  //     console.log('writtenFile', content);
  //   }
  // );

  // try {
  //   var process = new ffmpeg(path.join(__dirname, './audioFiles/blob.txt'));
  //   process.then(
  //     function (audio) {
  //       audio.fnExtractSoundToMP3(
  //         path.join(__dirname, './audioFiles/newFile.mp3'),
  //         function (error, file) {
  //           if (!error) {
  //             console.log('AudioFile:' + file);
  //             res.status(200).json({ message: file });
  //           }
  //         }
  //       );
  //     },
  //     function (err) {
  //       console.log('error', err);
  //     }
  //   );
  // } catch (error) {
  //   console.log('ERROR', error.code, error.content);
  // }