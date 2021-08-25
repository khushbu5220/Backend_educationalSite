const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = mongoose.Schema(
  {
    video: {
      type: String,
    },
    topic: {
      type: String,
    },
    desc: {
      type: String,
    },
    postedByMentor: {
      type: String,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
    },
  },
  {
    collection: "videos",
  }
);

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
