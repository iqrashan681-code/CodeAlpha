let defaultSongs = [
  {
    title: "YOU & ME",
    artist: "Artist 1",
    src: "music/You And Me Aura 128kbps..mp3.mp3",
  },
  {
    title: "KHAYAAL",
    artist: "Artist 2",
    src: "music/Khayaal (Slowed Reverb) [128 Kbps]-(SongsPk.com.se).mp3",
  },
  {
    title: "FEELINGA",
    artist: "Artist 3",
    src: "music/Feelinga Adhi Tape 128 Kbps.mp3",
  },
];

let storedSongs = JSON.parse(localStorage.getItem("userSongs")) || [];
let songs = [...defaultSongs, ...storedSongs];

let index = localStorage.getItem("currentSongIndex")
  ? parseInt(localStorage.getItem("currentSongIndex"))
  : 0;
let isShuffled = false;
let repeatMode = 0; // 0: off, 1: all, 2: one
let originalSongs = [...songs];
let audio = document.getElementById("audio");
let playBtn = document.getElementById("play");
let nextBtn = document.getElementById("next");
let prevBtn = document.getElementById("prev");
let shuffleBtn = document.getElementById("shuffle");
let repeatBtn = document.getElementById("repeat");
let progress = document.getElementById("progress");
let volume = document.getElementById("volume");
let title = document.getElementById("title");
let artist = document.getElementById("artist");
let currentTimeText = document.getElementById("current-time");
let totalTimeText = document.getElementById("total-time");

// Load Song
function loadSong(i) {
  audio.src = songs[i].src;
  title.innerText = songs[i].title;
  artist.innerText = songs[i].artist;
  audio.load();
  updatePlaylistHighlight();
}

loadSong(index);

// Play / Pause
playBtn.addEventListener("click", function () {
  if (audio.paused) {
    audio.play();
    playBtn.innerText = "⏸";
  } else {
    audio.pause();
    playBtn.innerText = "▶";
  }
});

// Next Song
nextBtn.addEventListener("click", function () {
  index = (index + 1) % songs.length;
  loadSong(index);
  audio.play();
  playBtn.innerText = "⏸";
});

// Previous Song
prevBtn.addEventListener("click", function () {
  index = index - 1 < 0 ? songs.length - 1 : index - 1;
  loadSong(index);
  audio.play();
  playBtn.innerText = "⏸";
});

// Shuffle
shuffleBtn.addEventListener("click", function () {
  isShuffled = !isShuffled;
  if (isShuffled) {
    shuffleArray(songs);
    shuffleBtn.style.color = "#ff0000";
    index = 0; // Reset to first in shuffled list
  } else {
    songs = [...originalSongs];
    shuffleBtn.style.color = "";
    index = originalSongs.findIndex((song) => song.title === title.innerText);
  }
  loadSong(index);
});

// Repeat
repeatBtn.addEventListener("click", function () {
  repeatMode = (repeatMode + 1) % 3;
  if (repeatMode === 0) {
    repeatBtn.innerText = "🔁";
    repeatBtn.style.color = "";
  } else if (repeatMode === 1) {
    repeatBtn.innerText = "🔁";
    repeatBtn.style.color = "#ff0000";
  } else {
    repeatBtn.innerText = "🔂";
    repeatBtn.style.color = "#ff0000";
  }
});

// Update Progress Bar
audio.addEventListener("timeupdate", function () {
  progress.value = (audio.currentTime / audio.duration) * 100;

  currentTimeText.innerText = formatTime(Math.floor(audio.currentTime));
  totalTimeText.innerText = formatTime(Math.floor(audio.duration));
});

// Seek Music
progress.addEventListener("input", function () {
  audio.currentTime = (progress.value * audio.duration) / 100;
});

// Volume Control
volume.addEventListener("input", function () {
  audio.volume = volume.value;
});

// Auto Next
audio.addEventListener("ended", function () {
  if (repeatMode === 2) {
    // Repeat one
    audio.play();
  } else {
    index = (index + 1) % songs.length;
    if (index === 0 && repeatMode === 0) {
      // Stop at end if no repeat
      playBtn.innerText = "▶";
      return;
    }
    loadSong(index);
    audio.play();
  }
});

// Format Time
function formatTime(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  return min + ":" + (sec < 10 ? "0" + sec : sec);
}

// Build Playlist
let playlist = document.getElementById("playlist");
function updatePlaylist() {
  playlist.innerHTML = "";
  songs.forEach((song, i) => {
    let li = document.createElement("li");
    let songInfo = document.createElement("span");
    songInfo.className = "song-info";
    songInfo.innerText = song.title + " — " + song.artist;
    songInfo.onclick = () => {
      index = i;
      loadSong(index);
      audio.play();
      playBtn.innerText = "⏸";
    };
    li.appendChild(songInfo);

    // Add delete button for user-added songs (not default songs)
    if (i >= defaultSongs.length) {
      let deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerText = "Delete";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Delete "${song.title}" by ${song.artist}?`)) {
          songs.splice(i, 1);
          storedSongs.splice(i - defaultSongs.length, 1);
          localStorage.setItem("userSongs", JSON.stringify(storedSongs));
          if (index >= songs.length) {
            index = 0;
          }
          updatePlaylist();
          loadSong(index);
        }
      };
      li.appendChild(deleteBtn);
    }

    playlist.appendChild(li);
  });
  updatePlaylistHighlight();
}

updatePlaylist();

// Update Playlist Highlight
function updatePlaylistHighlight() {
  const playlistItems = document.querySelectorAll("#playlist li");
  playlistItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Shuffle Array Function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Error Handling
audio.addEventListener("error", function () {
  alert("Error loading audio file. Please check the file path.");
});

// Keyboard Controls
document.addEventListener("keydown", function (e) {
  switch (e.code) {
    case "Space":
      e.preventDefault();
      playBtn.click();
      break;
    case "ArrowRight":
      nextBtn.click();
      break;
    case "ArrowLeft":
      prevBtn.click();
      break;
  }
});

// Set Initial Volume
volume.value = 0.5;
audio.volume = 0.5;

// Save Current Song to localStorage
function saveCurrentSong() {
  localStorage.setItem("currentSongIndex", index);
}

audio.addEventListener("play", saveCurrentSong);
nextBtn.addEventListener("click", saveCurrentSong);
prevBtn.addEventListener("click", saveCurrentSong);
playlist.addEventListener("click", saveCurrentSong);

// Add Song Functionality
let addSongBtn = document.getElementById("add-song");
addSongBtn.addEventListener("click", function () {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "audio/*";
  input.onchange = function (e) {
    let file = e.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = function (event) {
        let songTitle = prompt(
          "Enter song title:",
          file.name.replace(/\.[^/.]+$/, "")
        );
        let songArtist = prompt("Enter artist name:", "Unknown Artist");
        if (songTitle && songArtist) {
          let newSong = {
            title: songTitle,
            artist: songArtist,
            src: event.target.result, // blob URL
          };
          songs.push(newSong);
          storedSongs.push(newSong);
          localStorage.setItem("userSongs", JSON.stringify(storedSongs));
          updatePlaylist();
        }
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
});
