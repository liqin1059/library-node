var mongoose = require('mongoose');

// 用户
var UserSchema = new mongoose.Schema({
  user_id: String,
  name: String,
  password: String,
  time: Date,
  isManager: Boolean
});

mongoose.model('user', UserSchema);

module.exports = mongoose;