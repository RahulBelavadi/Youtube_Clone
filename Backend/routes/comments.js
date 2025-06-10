const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Post a comment
router.post('/', auth, async (req, res) => {
  try {
    const { text, videoId } = req.body;

    const comment = new Comment({
      text,
      video: videoId,
      user: req.user.id
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Post a reply to a comment
router.post('/reply', auth, async (req, res) => {
  try {
    const { text, commentId } = req.body;

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) return res.status(404).json({ error: 'Comment not found' });

    const reply = new Comment({
      text,
      user: req.user.id
    });

    await reply.save();

    parentComment.replies.push(reply._id);
    await parentComment.save();

    res.status(201).json(reply);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Like a comment
router.patch('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const userId = req.user.id;
    const index = comment.likes.indexOf(userId);

    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get comments for a video with populated replies
router.get('/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate('user', 'username')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'username' }
      })
      .sort('-createdAt');

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
