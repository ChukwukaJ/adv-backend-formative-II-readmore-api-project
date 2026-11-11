const express = require('express');
const controller = require('../controllers/authorController');

const router = express.Router();

router.route('/').post(controller.createAuthor).get(controller.getAuthors);

module.exports = router;
