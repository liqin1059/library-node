var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel = mongoose.model('user');
var URL = require('url');
//时间格式化
const moment = require('moment');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 用户创建
router.post('/create', (req, res) => {
  console.log('req.body', req.body);
  UserModel.findOne({
    name: req.body.name
  }, (err, doc) => {
    if (err) return console.log(err);
    if (doc) {
      res.json({
        code: '0001',
        data: null,
        desc: '用户名已存在'
      });
    } else {
      new UserModel({
        name: req.body.name,
        password: req.body.password,
        time: Date.now(),
        isManager: false,
      }).save((err, doc) => {
        console.log('内容', doc); //打印保存的数据
        if (err) return console.log(err);
        res.json({
          code: '0000',
          data: doc,
          desc: '添加用户成功'
        });
      });
    }
  });
});
// 用户列表
router.get('/list', (req, res, next) => {
  UserModel.count((err, doc) => {
    if (err) return console.log(err);
    pageNum = doc;
  })
  UserModel.find().sort('time').exec((err, _data, count) => {
    res.json({
      code: '0000',
      data: {
        dataList: _data,
        pageNum
      },
      desc: ''
    });
  });
});
// 更新用户
router.post('/update', (req, res) => {
  console.log(req.body);
  UserModel.findById(req.body.id, (err, doc) => {
    if (err) return console.log(err);
    doc.name = req.body.name;
    doc.password = req.body.password;
    doc.time = Date.now();
    doc.save((err, doc) => {
      if (err) return console.log(err);
      res.json({
        code: '0000',
        data: null,
        desc: '更新成功'
      });
    });
  });
});
// 删除用户
router.get('/delete', (req, res, next) => {
  var params = URL.parse(req.url, true).query;
  console.log(params);
  UserModel.findById(params.id, (err, doc) => {
    if (err) return console.log(err);
    doc.remove((err, doc) => {
      if (err) return console.log(err);
      res.json({
        code: '0000',
        data: null,
        desc: ''
      });
    })
  });
});
// 查询用户信息
router.get('/search', (req, res, next) => {
  var params = URL.parse(req.url, true).query;
  console.log(params);
  UserModel.findById(params.id, (err, doc) => {
    if (err) return console.log(err);
    res.json({
      code: '0000',
      data: doc,
      desc: ''
    });
  });
});
module.exports = router;
