const mongoose = require('mongoose');
const Author = require('../models/Author');
const Book = require('../models/Book');

const MIN_YEAR = 1450;

// Rule 1: the id must be well-formed AND point at a real author.
const authorExists = async (id) =>
  mongoose.isValidObjectId(id) && Boolean(await Author.exists({ _id: id }));

// Rule 3: returns an error message, or null when the values are fine.
const validateBookRules = ({ price, publishedYear }) => {
  const currentYear = new Date().getFullYear();
  if (price !== undefined && price <= 0) {
    return 'Price must be greater than zero';
  }
  if (publishedYear !== undefined && (publishedYear < MIN_YEAR || publishedYear > currentYear)) {
    return 'publishedYear must be between ' + MIN_YEAR + ' and ' + currentYear;
  }
  return null;
};

// Rule 2: per-author (author is in the filter) and case-insensitive (collation strength 2).
const titleExistsForAuthor = (author, title, excludeId) => {
  const filter = { author, title };
  if (excludeId) filter._id = { $ne: excludeId };
  return Book.exists(filter).collation({ locale: 'en', strength: 2 });
};

module.exports = { authorExists, validateBookRules, titleExistsForAuthor };
