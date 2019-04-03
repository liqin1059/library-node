var mongoose = require('mongoose');

//  书籍
var booksSchema = new mongoose.Schema({
  books_id: String,
  number: String,
  name: String,
  author: String,
  borrowDate: Date,
  press: String,
  fine: String,
  isBorrowed: Boolean
});

mongoose.model('books', booksSchema);

module.exports = mongoose;