const Book = require('../models/Book');
const handleError = require('../utils/handleError');
const { authorExists } = require('../utils/bookRules');

const createBook = async (req, res) => {
  try {
    const { title, genre, price, publishedYear, author } = req.body || {};

    if (!(await authorExists(author))) {
      return res.status(400).json({ message: 'author must be the id of an existing author' });
    }

    const book = await Book.create({ title, genre, price, publishedYear, author });
    await book.populate('author');
    res.status(201).json(book);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { createBook };
