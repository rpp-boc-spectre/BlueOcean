const express = require('express');
const path = require("path");
const { getUrls } = require('./controllers/audio');


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.listen(process.env.PORT || port, () => {
  console.log(`Listening on port ${process.env.PORT || port}`);
});

app.get('/audio', async (req, res) => {
  try {
    let urls = await getUrls()
    res.status(200).json(urls)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})