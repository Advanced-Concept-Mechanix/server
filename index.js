const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const expressValidator = require('express-validator');
require('dotenv').config();
const AppError = require('./errorHandling/AppError');
const errorMiddleware = require('./errorHandling/errorMiddleware');

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

// app.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//       var namespace = param.split('.')
//       , root = namespace.shift()
//       , formParam = root;

//     while(namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }
//     return {
//       param : formParam,
//       msg   : msg,
//       value : value
//     };
//   }
// }));

// app.use(expressValidator);

//Error handling
//error middleware

app.use(errorMiddleware);

//Routing

const users = require('./routes/userRoutes');
app.use('/users', users);

const products = require('./routes/productRoutes');
app.use('/products', products);

const transactions = require('./routes/transactionRoutes');
app.use('/transactions', transactions);

const blocks = require('./routes/blockchainRoutes');
app.use('/blocks', blocks);

//error handling for routes
// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

//Run the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});

//handling uncaught exceptions and unhandled rejections

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  process.exit(1);
});

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');

  process.exit(1);

});