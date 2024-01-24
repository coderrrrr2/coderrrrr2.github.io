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
  loadData(index);
  Audio.play();
});

function loadData(indexValue) {
  musicName.innerHTML = songs[indexValue - 1].name;
  musicArtist.innerHTML = songs[indexValue - 1].artist;
  Playimage.src = "./images/" + songs[indexValue - 1].img + ".jpeg";
  Audio.src = "./music/" + songs[indexValue - 1].audio + ".mp3";
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

let playlist = [];

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

  let song = {
    name: songName,
    artist: artist,
    duration: durations,
  };

  if (isSongAlreadyAdded(song)) {
    alert("Song already added!");
  } else {
    playlist.push(song);
    console.log("Added to playlist: " + song.name);
    addToPlaylistDiv(song);
  }

  function isSongAlreadyAdded(song) {
    for (let i = 0; i < playlist.length; i++) {
      if (
        playlist[i].name === song.name &&
        playlist[i].artist === song.artist &&
        playlist[i].duration === song.duration
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
    song.name + " - " + song.artist + " (" + song.duration + ")";
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
