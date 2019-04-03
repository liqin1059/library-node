var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel = mongoose.model('user');

/* GET home page. */
router.get('/', (req, res, next) => {
  // res.render('index', { title: 'Express' });
});
// 用户登录
router.post('/login', (req, res) => {
  UserModel.findOne({
    name: req.body.name
  }, (err, doc) => {
    if (err) return console.log(err);
    if (!doc) {
      res.json({
        code: '0002',
        data: null,
        desc: '用户名不存在'
      });
    } else {
      doc.comparePassword(req.body.password, function(err, isMatch) {
        if (err) return console.log(err);
        if (isMatch) {
          res.json({
            code: '0000',
            data: {
              name: req.body.name
            },
            desc: '登录成功'
          });
        } else {
          res.json({
            code: '0003',
            data: null,
            desc: '密码错误'
          });
        }
      });
    }
  });
});
module.exports = router;
       