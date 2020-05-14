const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
require('dotenv').config();

const app = express();

const MONGODB = `mongodb://127.0.0.1:27017/shanga`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || MONGODB, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("db connected...");
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Routing
// const users = require('./routes/userRoutes');
// app.use('/users', users);

const users = require('./routes/userRoutes');
app.use('/users', users);

const products = require('./routes/productRoutes');
app.use('/products', products);

const transactions = require('./routes/transactionRoutes');
app.use('/transactions', transactions);

const blocks = require('./routes/blockchainRoutes');
app.use('/blocks', blocks);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});
