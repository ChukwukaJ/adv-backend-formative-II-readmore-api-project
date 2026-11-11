const mongoose = require('mongoose');
const Book = require('../models/Book');
const handleError = require('../utils/handleError');
const { authorExists, validateBookRules, titleExistsForAuthor } = require('../utils/bookRules');

const COLLATION = { locale: 'en', strength: 2 };

const SORTABLE = ['price', 'title', 'publishedYear'];

const escapeRegex = (s) => s.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&');

const createBook = async (req, res) => {
  try {
    const { title, genre, price, publishedYear, author } = req.body || {};

    if (!(await authorExists(author))) {
      return res.status(400).json({ message: 'author must be the id of an existing author' });
    }

    const ruleError = validateBookRules({ price, publishedYear });
    if (ruleError) return res.status(422).json({ message: ruleError });

    if (typeof title === 'string' && (await titleExistsForAuthor(author, title.trim()))) {
      return res.status(409).json({ message: 'This author already has a book with that title' });
    }

    const book = await Book.create({ title, genre, price, publishedYear, author });
    await book.populate('author');
    res.status(201).json(book);
  } catch (err) {
    handleError(res, err);
  }
};

const getBooks = async (req, res) => {
  try {
    const { genre, minPrice, maxPrice, author, search, sort, order, page, limit } = req.query;
    const filter = {};

    // Each parameter only adds a key when it is present, so any combination works
    // and no parameters at all leaves filter = {} (everything).
    if (genre) filter.genre = genre;
    if (author) {
      if (!mongoose.isValidObjectId(author)) {
        return res.status(400).json({ message: 'author must be a valid id' });
      }
      filter.author = author;
    }
    if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
      if (Object.values(filter.price).some(Number.isNaN)) {
        return res.status(400).json({ message: 'minPrice and maxPrice must be numbers' });
      }
    }

    if (sort && !SORTABLE.includes(sort)) {
      return res.status(400).json({ message: 'sort must be one of: ' + SORTABLE.join(', ') });
    }
    if (order && !['asc', 'desc'].includes(order)) {
      return res.status(400).json({ message: 'order must be asc or desc' });
    }
    const sortBy = sort ? { [sort]: order === 'desc' ? -1 : 1 } : { createdAt: -1 };

    const total = await Book.countDocuments(filter).collation(COLLATION);
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = limit ? Math.max(parseInt(limit, 10) || 10, 1) : total;

    const results = await Book.find(filter)
      .collation(COLLATION)
      .sort(sortBy)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('author');

    res.json({ page: pageNum, limit: limitNum, total, results });
  } catch (err) {
    handleError(res, err);
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    handleError(res, err);
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const body = req.body || {};
    const updates = {};
    ['title', 'genre', 'price', 'publishedYear', 'author'].forEach((field) => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

    if (updates.author && !(await authorExists(updates.author))) {
      return res.status(400).json({ message: 'author must be the id of an existing author' });
    }

    const ruleError = validateBookRules(updates);
    if (ruleError) return res.status(422).json({ message: ruleError });

    const title = updates.title ?? book.title;
    const author = updates.author ?? book.author;
    if (typeof title === 'string' && (await titleExistsForAuthor(author, title.trim(), book._id))) {
      return res.status(409).json({ message: 'This author already has a book with that title' });
    }

    book.set(updates);
    await book.save();
    await book.populate('author');
    res.json(book);
  } catch (err) {
    handleError(res, err);
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
};
