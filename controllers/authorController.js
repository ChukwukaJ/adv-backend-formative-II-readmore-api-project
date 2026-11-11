const Author = require('../models/Author');
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

module.exports = { createAuthor, getAuthors, getAuthor };
