const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid id: ' + req.params.id });
  }
  next();
};

module.exports = validateObjectId;
