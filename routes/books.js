var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var booksModel = mongoose.model('books');
var URL = require('url');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// 新增书籍
router.post('/create', (req, res) => {
  console.log('req.body', req.body);
  booksModel.findOne({
    name: req.body.name
  }, (err, doc) => {
    if (err) return console.log(err);
    console.log('内容', doc); //打印保存的数据
    if (doc) {
      res.json({
        code: '0001',
        data: null,
        desc: '书籍名称已存在'
      });
    } else {
      new booksModel({
        number: req.body.number,
        name: req.body.name,
        author: req.body.author,
        press: req.body.press,
        fine: '',
        isBorrowed: false
      }).save((err, doc) => {
        res.json({
          code: '0000',
          data: null,
          desc: '添加书籍成功'
        });
      });
    }
  });
});
// 书籍列表
router.get('/list', (req, res, next) => {
  booksModel.find().sort('id').exec((err, _data, count) => {
    res.json({
      code: '0000',
      data: _data,
      desc: ''
    });
  });
});
// 删除书籍
router.get('/delete', (req, res, next) => {
  var params = URL.parse(req.url, true).query;
  console.log(params);
  booksModel.findById(params.id, (err, doc) => {
    if (err) return console.log(err);
    doc.remove((err, doc) => {
      if (err) return console.log(err);
      res.json({
        code: '0000',
        data: null,
        desc: '移除成功'
      });
    })
  });
});
// 更新书籍
router.post('/update', (req, res) => {
  console.log(req.body);
  booksModel.findById(req.body._id, (err, doc) => {
    if (err) return console.log(err);
    doc.number = req.body.number;
    doc.name = req.body.name;
    doc.author = req.body.author;
    doc.press = req.body.press;
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
// 查询书籍
router.get('/search', (req, res) => {
  console.log(req.body);
  var params = URL.parse(req.url, true).query;
  var _filter={
    $or: [  // 多字段同时匹配
      {name: {$regex: params.keyword}}
    ]
  }
  booksModel.count(_filter, (err, doc) => {
    if (err) return console.log(err);
    count = doc;
  });
  booksModel.find(_filter).limit(10) // 最多显示10条
    .sort({'_id': -1}) // 倒序
    .exec( (err, doc) => { // 回调
      if (err) return console.log(err);
      res.json({
        code: '0000',
        data: doc,
        count: count,
        desc: '查询成功'
      });
    });
});
// 上传图片
router.post('/upload', (req, res) => {
  console.log(req.files[0]);
});
module.exports = router;