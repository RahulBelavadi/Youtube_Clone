const mongoose =  require("mongoose");

const channelSchema = new mongoose.Schema({
  channelName: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  channelBanner: String,
  subscribers: { type: Number, default: 0 },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }]
}, { timestamps: true });

module.exports = mongoose.model("Channel", channelSchema);

