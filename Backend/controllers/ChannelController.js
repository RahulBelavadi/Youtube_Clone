const Channel = require('../models/Channel');

const createChannel = async (req, res) => {
  const { channelName, description, channelBanner, profileUrl } = req.body;
  try {
    const newChannel = await new Channel({
      channelName,
      description,
      channelBanner,
      owner: req.userId,
      profileUrl,
    }).save();

    res.status(201).json({ success: true, message: "Channel created", channel: newChannel });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating channel", error: err.message });
  }
};

const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.userId });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createChannel, getChannelById, getMyChannel };
