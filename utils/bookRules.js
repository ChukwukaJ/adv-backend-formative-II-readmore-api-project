const mongoose = require('mongoose');
const Author = require('../models/Author');

// Rule 1: the id must be well-formed AND point at a real author.
const authorExists = async (id) =>
  mongoose.isValidObjectId(id) && Boolean(await Author.exists({ _id: id }));

module.exports = { authorExists };
