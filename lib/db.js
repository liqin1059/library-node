var mongoose = require('mongoose');
require('../models/users');
require('../models/books');
var config = require('../config/config');
mongoose.connect(config.mongodb, { useNewUrlParser:true }, (err)=> {
    if(err) {
      console.log('Connection Error:' + err)
    } else {
      console.log('Connection success!')
    }
});
var db = mongoose.connection;
db.on('error', function callback() {
  console.log('Connection error');
});
db.once('open', function callback() {
  console.log('connected!');
});
module.exports = mongoose;