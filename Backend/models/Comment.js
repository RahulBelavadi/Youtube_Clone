const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: false  // Replies don't need a video reference
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema);
