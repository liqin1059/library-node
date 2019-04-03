var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
// 定义加密密码计算强度
var SALT_WORK_FACTOR = 10;

// 用户
var UserSchema = new mongoose.Schema({
  user_id: String,
  name: String,
  password: String,
  time: Date,
  isManager: Boolean
});
// 加密
UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    console.log(user.password);
    if (err) { return next(err) };
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) { return next(err) };
      user.password = hash;
      next();
    });
  });
});
// 解密
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err) };
    cb(null, isMatch);
  });
}

mongoose.model('user', UserSchema);

module.exports = mongoose;