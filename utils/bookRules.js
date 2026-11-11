const mongoose = require('mongoose');
const Author = require('../models/Author');
const Book = require('../models/Book');

// Rule 1: the id must be well-formed AND point at a real author.
const authorExists = async (id) =>
  mongoose.isValidObjectId(id) && Boolean(await Author.exists({ _id: id }));

// Rule 2: per-author (author is in the filter) and case-insensitive (collation strength 2).
const titleExistsForAuthor = (author, title, excludeId) => {
  const filter = { author, title };
  if (excludeId) filter._id = { $ne: excludeId };
  return Book.exists(filter).collation({ locale: 'en', strength: 2 });
};

module.exports = { authorExists, titleExistsForAuthor };
