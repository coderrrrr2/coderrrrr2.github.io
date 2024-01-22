const express = require("express");
const mongoose = require("mongoose");
const Playlist = require("./playListModel"); // Import the playlist model

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/musicplaylists", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static("public"));
app.use(express.json());

app.get("/playlist/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/playlist", async (req, res) => {
  try {
    const playlistData = req.body;
    const playlist = await Playlist.create(playlistData);
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
