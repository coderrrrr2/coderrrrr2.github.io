const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (Make sure MongoDB is running)
mongoose.connect("mongodb://localhost:27017/musicplayer", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Song model
const Song = mongoose.model("Song", {
  name: String,
  artist: String,
  img: String,
  audio: String,
});

app.use(bodyParser.json());

// API endpoint to add a song
app.post("/api/songs", async (req, res) => {
  try {
    const { name, artist, img, audio } = req.body;

    // Create a new song instance
    const newSong = new Song({
      name,
      artist,
      img,
      audio,
    });

    // Save the song to the database
    await newSong.save();

    res.status(201).json({ message: "Song added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
