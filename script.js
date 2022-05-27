let searchTxt = document.querySelector(".textInp");
let topBody = document.querySelector(".topBody");

// Execute a function when the user presses a key on the keyboard
searchTxt.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    event.preventDefault();
    if (searchTxt.value.trim().length == 0) {
      alert("Please Enter something");
      return;
    }
    fetchData(searchTxt.value);
    searchTxt.innerHTML = "";
    topBody.innerHTML = "";
  }
});

/**
 *
 * @param {String}  queryText  in string format album / song name
 * and passed to filldata method to make UI of song list
 */
function fetchData(queryText) {
  let resonseObj = fetch(
    "https://jiosaavn-api-v3.vercel.app/search?query=" + queryText
  );

  resonseObj
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log("data", data.results);
      if (data.results.length == 0) {
        alert("No data found for your input");
        return;
      }
      fillData(data);
    })
    .catch((error) => {
      console.log(error);
      alert("Error while fetching data!. Please try later", error);
    });
}

/**
 *
 * @param {Array of Object} data
 * response from server is used to make DOM UI and show details on page
 */
function fillData(data) {
  let songlist = document.createElement("ol");
  songlist.setAttribute("class", "songlist");
  data.results.forEach((index) => {
    let songUI = createSongList(index);
    songlist.append(songUI);
    topBody.append(songlist);
  });
}

/**
 *
 * @param {object} index
 * @returns li item with single song details
 * all information about song is appended amd song details are appended here
 */
function createSongList(index) {
  let li = document.createElement("li");
  li.style.listStyleImage = `url('${index.image}')`;
  let songImg = document.createElement("img");
  songImg.setAttribute("src", index.image);
  songImg.setAttribute("width", "50");
  songImg.setAttribute("height", "50");
  songImg.setAttribute("alt", "Image not Available");
  let title = document.createElement("div");
  title.innerText = index.title;

  let language = document.createElement("div");
  language.innerText = index.more_info.language;

  let singers = document.createElement("div");
  singers.innerText = index.more_info.singers;
  li.append(songImg, title, language, singers);
  fetchSongData(li, index.api_url.song);
  return li;
}

/**
 *
 * @param {HTML Element} li
 * @param {nest API URL} songUrl  this url contains detils of
 * songs like duration,source of mp3 which is used to bind to audio tag
 * @returns  updated list item with duration and mp3 source
 */
function fetchSongData(li, songUrl) {
  let songresponse = fetch(songUrl);
  songresponse
    .then((response) => {
      return response.json();
    })
    .then((songdata) => {
      let songDuration = document.createElement("div");
      songDuration.innerText = songdata.duration;
      let audiotag = document.createElement("audio");
      audiotag.setAttribute("controls", true);
      audiotag.setAttribute("controlsList", "nodownload");
      let audioSrctag = document.createElement("source");
      audioSrctag.setAttribute("src", songdata.media_urls["320_KBPS"]);
      audioSrctag.setAttribute("type", "audio/mpeg");
      audiotag.append(
        audioSrctag,
        " Your browser does not support the audio tag."
      );

      li.append(songDuration, audiotag);

      return li;
    });
}

/**
 * adding event listener to all audio tags and looping over them
 * if current audio tag is not target/play event then
 * pasuing it  in this way all audio tags will be paused except one which
 * has play event/clicked play button
 *
 */
document.addEventListener(
  "play",
  function (e) {
    var audios = document.getElementsByTagName("audio");
    for (var i = 0, len = audios.length; i < len; i++) {
      if (audios[i] != e.target) {
        audios[i].pause();
      }
    }
  },
  true
);

/**
 * adding ended event on document
 * whenever ended event occurs we are getting element on which it occured
 * finding next li element of it and then finding audio tag of that next element
 * calling play method on that next audio tag
 */
document.addEventListener(
  "ended",
  function (e) {
    let nextLi = e.target.parentElement.nextSibling;
    let audioTag = nextLi.querySelector("audio");
    audioTag.play();
    return;
  },
  true
);
