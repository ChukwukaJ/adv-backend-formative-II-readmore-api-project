const express = require('express');
const controller = require('../controllers/bookController');

const router = express.Router();

router.route('/').post(controller.createBook);

module.exports = router;
