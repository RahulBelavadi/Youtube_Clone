const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Upload video + thumbnail
router.post(
  '/upload',
  auth,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      const videoPath = req.files.video[0].path.replace(/\\/g, '/').replace(/^.*uploads\//, '');
      const thumbnailPath = req.files.thumbnail[0].path.replace(/\\/g, '/').replace(/^.*uploads\//, '');

      const video = new Video({
        title,
        description,
        videoUrl: videoPath,
        thumbnailUrl: thumbnailPath,
        uploadedBy: req.user.id,
      });

      await video.save();
      res.status(201).json({ success: true, video });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
);

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('uploadedBy', 'channelName');
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Like video
router.patch('/:id/like', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.likes = (video.likes || 0) + 1;
    await video.save();

    res.status(200).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike video
router.patch('/:id/dislike', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.dislikes = (video.dislikes || 0) + 1;
    await video.save();

    res.status(200).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment view count (no auth needed)
router.patch('/:id/view', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.views = (video.views || 0) + 1;
    await video.save();

    res.status(200).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get videos uploaded by logged-in user
router.get('/myvideos', auth, async (req, res) => {
  try {
    const videos = await Video.find({ uploadedBy: req.user.id }).populate('uploadedBy', 'channelName');
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
