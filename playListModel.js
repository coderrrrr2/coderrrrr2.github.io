const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  songs: [
    {
      name: String,
      artist: String,
      img: String,
      audio: String,
    },
  ],
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
