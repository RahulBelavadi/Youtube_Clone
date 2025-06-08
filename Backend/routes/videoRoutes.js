const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Upload route
router.post(
  '/upload',
  auth,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      // Convert backslashes to forward slashes & remove 'uploads/' prefix
    // Replace full absolute paths with just the relative ones
      const videoPath = req.files.video[0].path
        .replace(/\\/g, '/')
        .replace(/^.*uploads\//, ''); // keep only "videos/filename"

      const thumbnailPath = req.files.thumbnail[0].path
        .replace(/\\/g, '/')
        .replace(/^.*uploads\//, ''); // keep only "thumbnails/filename"


      const video = new Video({
        title,
        description,
        videoUrl: videoPath,
        thumbnailUrl: thumbnailPath,
        uploadedBy: req.user.id
      });

      await video.save();
      res.status(201).json({ success: true, video });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
);

// Fetch all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('uploadedBy', 'channelName');
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Like a video
router.patch('/:id/like', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.likes = (video.likes || 0) + 1;

    await video.save();
    res.status(200).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike a video
router.patch('/:id/dislike', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.dislikes = (video.dislikes || 0) + 1;

    await video.save();
    res.status(200).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment video views
router.patch('/:id/view', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.views = (video.views || 0) + 1;

    await video.save();
    res.status(200).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch videos uploaded by the logged-in user
router.get('/myvideos', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const videos = await Video.find({ uploadedBy: userId }).populate('uploadedBy', 'channelName');
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});



module.exports = router;
