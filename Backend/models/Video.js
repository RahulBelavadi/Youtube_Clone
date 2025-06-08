const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnailUrl: String,
  videoUrl: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  },
  views: { type: Number, default: 0 },

  likes: { type: Number, default: 0 },      // Add this line
  dislikes: { type: Number, default: 0 },   // Add this line

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);
