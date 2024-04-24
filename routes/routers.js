const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router.get('/upload', uploadController.getHomePage);
router.post('/upload', uploadController.uploadImage);

module.exports = router;