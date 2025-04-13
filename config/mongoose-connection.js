const mongoose = require('mongoose');
const config = require('config');
const dbgr = require('debug')('development:mongoose');

const uri = `${config.get('MONGODB_URI')}/grocery`;


 mongoose.connect(uri)
  .then(() => dbgr('Connected to MongoDB'))
  .catch(err => dbgr(`MongoDB connection error: ${err}`));

 module.exports = mongoose.connection;
