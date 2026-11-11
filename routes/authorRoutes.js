const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const controller = require('../controllers/authorController');

const router = express.Router();

router.route('/').post(controller.createAuthor).get(controller.getAuthors);

router
  .route('/:id')
  .get(validateObjectId, controller.getAuthor)
  .put(validateObjectId, controller.updateAuthor)
  .delete(validateObjectId, controller.deleteAuthor);

router.get('/:id/books', validateObjectId, controller.getAuthorBooks);

module.exports = router;
