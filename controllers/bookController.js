const Book = require('../models/Book');
const handleError = require('../utils/handleError');

const createBook = async (req, res) => {
  try {
    const { title, genre, price, publishedYear, author } = req.body || {};

    const book = await Book.create({ title, genre, price, publishedYear, author });
    res.status(201).json(book);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { createBook };
