const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const controller = require('../controllers/bookController');

const router = express.Router();

router.route('/').post(controller.createBook).get(controller.getBooks);

router
  .route('/:id')
  .get(validateObjectId, controller.getBook);

module.exports = router;
