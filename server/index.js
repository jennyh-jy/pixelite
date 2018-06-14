
const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();

// require('./routes')(app);
require('./models/UserNew');
// require('./services/rekognition');

mongoose.Promise = global.Promise;
// { useMongoClient: true } --> for deprecating a mongoose warning
mongoose.connect(keys.mongoURI, { useMongoClient: true });

// the order is matter
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Pixelite Server is ready..'));
