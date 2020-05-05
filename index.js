const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

const MONGODB = `mongodb://127.0.0.1:27017/shanga`;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || MONGODB, { useNewUrlParser: true });

const db = mongoose.connection;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});