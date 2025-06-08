const express = require('express');
const router = express.Router();
const { createChannel, getChannelById, getMyChannel } = require('../controllers/channelController');
const verifyToken = require('../middleware/verifyToken');

router.post('/create', verifyToken, createChannel);
router.get('/me', verifyToken, getMyChannel);
router.get('/:id', getChannelById);

module.exports = router;
