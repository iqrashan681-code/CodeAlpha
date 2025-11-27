let songs = [
    {
        title: "YOU & ME",
        artist: "Artist 1",
    src: "music/You And Me Aura 128kbps..mp3.mp3" 
    },
    {
        title: "KHAYAAL",
        artist: "Artist 2",
        src: "music/Khayaal (Slowed Reverb) [128 Kbps]-(SongsPk.com.se).mp3"
    },
    {
      title: "FEELINGA",
        artist: "Artist 3",
        src: "music/Feelinga Adhi Tape 128 Kbps.mp3"
    }

];

let index = 0;
let audio = document.getElementById("audio");
let playBtn = document.getElementById("play");
let nextBtn = document.getElementById("next");
let prevBtn = document.getElementById("prev");
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
    index = (index + 1) % songs.length;
    loadSong(index);
    audio.play();
});

// Format Time
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
}

// Build Playlist
let playlist = document.getElementById("playlist");
songs.forEach((song, i) => {
    let li = document.createElement("li");
    li.innerText = song.title + " — " + song.artist;

    li.onclick = () => {
        index = i;
        loadSong(index);
        audio.play();
        playBtn.innerText = "⏸";
    };

    playlist.appendChild(li);
});
