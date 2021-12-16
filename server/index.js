const express = require('express');
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.listen(process.env.PORT || port, () => {
  console.log(`Listening on port ${process.env.PORT || port}`);
});