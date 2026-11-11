const Author = require('../models/Author');
const Book = require('../models/Book');
const handleError = require('../utils/handleError');

const createAuthor = async (req, res) => {
  try {
    const { name, country, bio } = req.body || {};
    const author = await Author.create({ name, country, bio });
    res.status(201).json(author);
  } catch (err) {
    handleError(res, err);
  }
};

const getAuthors = async (req, res) => {
  try {
    res.json(await Author.find());
  } catch (err) {
    handleError(res, err);
  }
};

const getAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.json(author);
  } catch (err) {
    handleError(res, err);
  }
};

const updateAuthor = async (req, res) => {
  try {
    const body = req.body || {};
    const updates = {};
    ['name', 'country', 'bio'].forEach((field) => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

    const author = await Author.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.json(author);
  } catch (err) {
    handleError(res, err);
  }
};

// Policy: Option A. Block the delete (409) while the author still has books.
const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });

    const bookCount = await Book.countDocuments({ author: author._id });
    if (bookCount > 0) {
      return res.status(409).json({
        message:
          'Cannot delete author: ' + bookCount + ' book(s) still belong to them. Delete or reassign those books first.',
      });
    }

    await author.deleteOne();
    res.json({ message: 'Author deleted' });
  } catch (err) {
    handleError(res, err);
  }
};

const getAuthorBooks = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.json(await Book.find({ author: author._id }));
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorBooks,
};
