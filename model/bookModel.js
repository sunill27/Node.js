const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    unique: true,
    require: true,
  },
  bookPrice: {
    type: String,
  },
  isbnNumber: {
    type: Number,
  },
  authorName: {
    type: String,
  },
  publishedAt: {
    type: String,
  },
  publication: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
