const content = document.querySelector(".content");
Playimage = content.querySelector(".music-image img");
musicName = content.querySelector(".music-titles .name");
musicArtist = content.querySelector(".music-titles .artist");
Audio = document.querySelector(".main-song");
playBtn = content.querySelector(".play-pause");
playBtnIcon = content.querySelector(".play-pause span");
prevBtn = content.querySelector("#prev");
nextBtn = content.querySelector("#next");
progressBar = content.querySelector(".progress-bar");
progressDetails = content.querySelector(".progress-details");
repeatBtn = content.querySelector("#repeat");
Shuffle = content.querySelector("#shuffle");

let index = 1;

window.addEventListener("load", () => {
  Audio.play();
});

function loadData(indexValue) {
  musicName.innerHTML = songs[indexValue - 1].name;
  musicArtist.innerHTML = songs[indexValue - 1].artist;
  Playimage.src = songs[indexValue - 1].coverImage;
  Audio.src = songs[indexValue - 1].filePath;
}

playBtn.addEventListener("click", () => {
  const isMusicPaused = content.classList.contains("paused");
  if (isMusicPaused) {
    pauseSong();
    console.log(songs[index - 1]);
  } else {
    playSong();
  }
});

function playSong() {
  content.classList.add("paused");
  playBtnIcon.innerHTML = "pause";
  Audio.play();
}

function pauseSong() {
  content.classList.remove("paused");
  playBtnIcon.innerHTML = "play_arrow";
  Audio.pause();
}

nextBtn.addEventListener("click", () => {
  nextSong();
});

prevBtn.addEventListener("click", () => {
  prevSong();
});

function nextSong() {
  index++;
  if (index > songs.length) {
    index = 1;
  } else {
    index = index;
  }
  loadData(index);
  playSong();
}

function prevSong() {
  index--;
  if (index <= 0) {
    index = songs.length;
  } else {
    index = index;
  }
  loadData(index);
  playSong();
}

Audio.addEventListener("timeupdate", (e) => {
  const initialTime = e.target.currentTime; // Get current music time
  const finalTime = e.target.duration; // Get music duration
  let BarWidth = (initialTime / finalTime) * 100;
  progressBar.style.width = BarWidth + "%";

  progressDetails.addEventListener("click", (e) => {
    let progressValue = progressDetails.clientWidth;
    let clickedOffsetX = e.offsetX;
    let MusicDuration = Audio.duration;

    Audio.currentTime = (clickedOffsetX / progressValue) * MusicDuration;
  });

  // Timer Logic
  Audio.addEventListener("loadeddata", () => {
    let finalTimeData = content.querySelector(".final");

    // Update finalDuration
    let AudioDuration = Audio.duration;
    let finalMinutes = Math.floor(AudioDuration / 60);
    let finalSeconds = Math.floor(AudioDuration % 60);
    if (finalSeconds < 10) {
      finalSeconds = "0" + finalSeconds;
    }
    finalTimeData.innerText = finalMinutes + ":" + finalSeconds;
  });

  //Update Current Duration
  let currentTimeData = content.querySelector(".current");
  let CurrentTime = Audio.currentTime;
  let currentMinutes = Math.floor(CurrentTime / 60);
  let currentSeconds = Math.floor(CurrentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = "0" + currentSeconds;
  }
  currentTimeData.innerText = currentMinutes + ":" + currentSeconds;

  // Repeat button logic
  repeatBtn.addEventListener("click", () => {
    Audio.currentTime = 0;
  });
});

// Shuffle button logic
Shuffle.addEventListener("click", () => {
  var randIndex = Math.floor(Math.random() * songs.length) + 1;
  loadData(randIndex);
  playSong();
});

Audio.addEventListener("ended", () => {
  index++;
  if (index > songs.length) {
    index = 1;
  }
  loadData(index);
  playSong();
});

let localplaylist = [];

function addSongToPlaylist(index) {
  let duration = () => {
    // Update finalDuration
    let AudioDuration = Audio.duration;
    let finalMinutes = Math.floor(AudioDuration / 60);
    let finalSeconds = Math.floor(AudioDuration % 60);
    if (finalSeconds < 10) {
      finalSeconds = "0" + finalSeconds;
    }
    return (duration = finalMinutes + ":" + finalSeconds);
  };
  let songName = songs[index - 1].name;
  let artist = songs[index - 1].artist;
  let durations = `${duration()}`;
  let id = songs[index - 1]._id;

  let song = {
    name: songName,
    artist: artist,
  };

  if (isSongAlreadyAdded(song)) {
    alert("Song already added!");
  } else {
    localplaylist.push(song);
    console.log("Added to playlist: " + song.name);
    addToPlaylistDiv(song);
    addToPlaylist({...song, id})

  }

  function isSongAlreadyAdded(song) {
    for (let i = 0; i < localplaylist.length; i++) {
      if (
        localplaylist[i].name === song.name &&
        localplaylist[i].artist === song.artist
      ) {
        return true;
      }
    }
    return false;
  }
}

function addToPlaylistDiv(song) {
  let playlistDiv = document.getElementById("playlist-container");
  let button = document.createElement("button");
  button.textContent =
    song.name + " - " + song.artist;
  button.style.width = "100%";
  button.style.marginBottom = "10px";
  button.addEventListener("click", function () {});
  playlistDiv.appendChild(button);
  playlistDiv.appendChild(document.createElement("br")); // Add line break
}

let input = document.createElement("input");
input.style.height = "30px";
input.style.fontSize = "15px";
input.style.fontFamily = "algerian";

function changeName() {
  let playName = document.getElementById("playName");
  playName.innerText = input.value;
  hide();
  changePlaylistname(input.value)
}

async function changePlaylistname(newName){

  try {
    const response = await fetch(`http://localhost:3000/api/playlists/${playListId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Playlist name changed successfully");
      // Optionally, you can update the playlist container here if needed
    } else {
      console.error("Failed to change playlist name:", result.details);
    }
  } catch (error) {
    console.error("Error adding song to playlist:", error);
  }
}


function change() {
  let changename = document.getElementById("changename");
  let change = document.getElementById("change");
  change.innerHTML = ""; // Clear previous playlist

  input.placeholder = "Playlist Name:";
  change.appendChild(input);

  changename.style.display = "block";
}

function hide() {
  let changename = document.getElementById("changename");
  changename.style.display = "none";
}

async function addToPlaylist(song) {
  const songIdToAdd = song.id; 
  const playlistId = playListId;

  if (!playListId){
    alert("No playlist found!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/playlists/${playlistId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ songId: songIdToAdd }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Song added to playlist successfully");
      // Optionally, you can update the playlist container here if needed
    } else {
      console.error("Failed to add song to playlist:", result.details);
    }
  } catch (error) {
    console.error("Error adding song to playlist:", error);
  }
}

async function fetchSongs(){
  try{
    const data = await fetch("http://localhost:3000/api/songs");
    const result = await data.json();
    songs = result.details;
    loadData(index)

    let playlistDiv = document.getElementById("allsongs-container");

    result.details.forEach((song, idx)=>{
      let button = document.createElement("button");
      button.textContent =
        song.name + " - " + song.artist;
      button.style.width = "100%";
      button.style.marginBottom = "10px";
      button.addEventListener("click", () => {loadData(idx + 1); index = idx + 1});
      playlistDiv.appendChild(button);
      playlistDiv.appendChild(document.createElement("br")); // Add line break
    })

  }catch(err){
    alert("Error fetching songs, check consloe for details");
    console.error(err);
  }
}

function showCreatePlaylistForm() {
  document.getElementById("createPlaylistForm").style.display = "block";
  fetchSongsForPlaylist();
}

async function fetchSongsForPlaylist() {
  const response = await fetch("http://localhost:3000/api/songs");
  const { success, details } = await response.json();

  if (success) {
    const selectSongsDropdown = document.getElementById("selectedSongs");

    // Clear previous options
    selectSongsDropdown.innerHTML = "";

    // Populate dropdown with songs from the database
    details.forEach(song => {
      const option = document.createElement("option");
      option.value = song._id; // Assuming song._id is the MongoDB ObjectId
      option.text = `${song.name} - ${song.artist}`;
      selectSongsDropdown.appendChild(option);
    });
  } else {
    console.error("Failed to fetch songs:", details);
  }
}

// Create playlist function
async function createPlaylist() {
  const playlistName = document.getElementById("playlistName").value;
  const selectedSongs = Array.from(document.getElementById("selectedSongs").selectedOptions)
    .map(option => option.value);
    console.log(selectedSongs)

  try {
    const response = await fetch("http://localhost:3000/api/playlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: playlistName, songs: selectedSongs }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Playlist created successfully");
      document.getElementById("createPlaylistForm").style.display = "none";

    } else {
      console.error("Failed to create playlist:", result.details);
    }
  } catch (error) {
    console.error("Error creating playlist:", error);
  }
}

// Update the fetchSongs function to also fetch playlists
async function fetchSongsAndPlaylists() {
  await fetchSongs();
  await fetchPlaylists();
}

let playListId = "";

// Fetch playlists from the server and update the playlist container
async function fetchPlaylists() {
  const response = await fetch("http://localhost:3000/api/playlists");
  const { success, details } = await response.json();

  if (success) {
    const playlistContainer = document.getElementById("playlist-container");
    const playlistName = document.getElementById("playName");
    if (details.length > 0){
      const playlist = details[0];
      playListId = playlist._id;
      // Populate playlist container with playlists from the database
      const playlistItem = document.createElement("div");
      playlistItem.className = "playlist-item";
      playlistName.innerHTML = `<h3>${playlist.name}</h3>`;
  
      // Assuming playlist.songs is an array of song objects with 'name' and 'artist'
      if (playlist.songs && playlist.songs.length > 0) {
        playlist.songs.forEach(song => {
          let button = document.createElement("button");
          button.textContent =
            song.name + " - " + song.artist;
          button.style.width = "100%";
          button.style.marginBottom = "10px";
          button.addEventListener("click", () => loadData(idx + 1));
          localplaylist.push(song);

          playlistContainer.appendChild(button);
        });
      }
    } else {
      console.error("Failed to fetch playlists:", details);
    }
    }

}

// Call fetchSongsAndPlaylists when the page loads
document.addEventListener("DOMContentLoaded", fetchSongsAndPlaylists);
