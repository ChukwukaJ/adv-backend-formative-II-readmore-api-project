const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const controller = require('../controllers/authorController');

const router = express.Router();

router.route('/').post(controller.createAuthor).get(controller.getAuthors);

router
  .route('/:id')
  .get(validateObjectId, controller.getAuthor);

module.exports = router;
