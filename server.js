const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (Make sure MongoDB is running)
const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/music_player_db",);
    console.log("Connected to mongodb");
  } catch (error) {
    console.error("Could not connect to db", error);
  }
};


// Create a Song model
const Song = mongoose.model("Song", {
  name: String,
  artist: String,
  img: String,
  audio: String,
});

const Playlist = mongoose.model("Playlist", {
  name: String,
  songs: [{
    type: mongoose.SchemaTypes.ObjectId, 
    ref: "Song"
}]
});

app.use(bodyParser.json());
app.use(cors({}))
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

app.post("/api/playlist/:playlistId", async(req, res) => {
  try{
    const {playlistId} = req.params;
    const playlist = await Playlist.findById(playlistId);
    if(!playlist) return res.status(400).json({success: false, details: "Playlist doesnt exixt"});
  }catch(err){
    return res.status(500).json({success: false, details: err});
  }
});

app.post("/api/playlists/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songId , name } = req.body;

    // Find the playlist by ID
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(400).json({ success: false, details: "Playlist doesn't exist" });
    }

    if (name){
      playlist.name = name;
    }

    // Check if the songId is already in the playlist
    if (playlist.songs.includes(songId)) {
      return res.status(201).json();
    }

    // Add the song to the playlist
    if (songId){
      playlist.songs.push(songId);
    }
    await playlist.save();

    return res.json({ success: true, details: "Song added to playlist successfully" });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    return res.status(500).json({ success: false, details: "Internal Server Error" });
  }
});

app.get("/api/playlists", async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("songs");
    return res.json({ success: true, details: playlists });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, details: "Internal Server Error" });
  }
});

app.post("/api/playlist", async (req, res) => {
  try {
    const { name, songs } = req.body;

    // Create a new playlist instance
    const newPlaylist = new Playlist({
      name,
      songs: songs.map(songId => new mongoose.Types.ObjectId(songId)),
    });

    // Save the playlist to the database
    await newPlaylist.save();

    res.status(201).json({ success: true, details: "Playlist created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, details: "Internal Server Error" });
  }
});

// Get all songs
app.get("/api/songs", async (req, res) => {
  const songs = await Song.find();
  return res.json({success: true, details: songs});
});

app.listen(PORT, async() => {
  await connectDb()
  console.log(`Server is running on http://localhost:${PORT}`);
});
