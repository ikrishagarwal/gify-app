// Created by Krish and Good_Bits

let gifContainer;
let paginationElement;
let hiddenInput; // used for copy to clipboard function
let count = 0;
let clock;

window.addEventListener("load", () => {
  // this element contains all the Gifs
  gifContainer = document.querySelector(".gif-container");
  hiddenInput = document.querySelector("#hidden-input");
  paginationElement = document.querySelector(".pagination");
});

function addGif(imgSrc, imgUrl) {
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = `
    <div class="gif" data-url="${imgUrl}">
        <img src="${imgSrc}" alt="GIF">
        <div class="url btn" onclick="copyUrlToClipboard(this)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="#fff">
                    <path fill="#fff" d="M14.242,9.758c-0.49-0.49-1.052-0.878-1.659-1.169C12.208,8.966,12,9.468,12,10 c0,0.213,0.04,0.415,0.102,0.608c0.259,0.161,0.505,0.343,0.726,0.564C13.583,11.928,14,12.932,14,14s-0.416,2.073-1.171,2.829 l-3,2.999c-1.512,1.512-4.146,1.512-5.657,0C3.416,19.072,3,18.068,3,17s0.416-2.072,1.171-2.828l2.104-2.104 C6.098,11.401,6,10.709,6,10c0-0.162,0.013-0.323,0.023-0.483C5.934,9.596,5.843,9.673,5.757,9.758l-3,3C1.624,13.891,1,15.397,1,17 s0.624,3.109,1.757,4.242C3.891,22.376,5.397,23,7,23s3.109-0.624,4.243-1.758l3-2.999C15.375,17.109,16,15.603,16,14 S15.375,10.891,14.242,9.758z"></path> 
                    <path d="M21.243,2.758C20.109,1.624,18.603,1,17,1s-3.109,0.624-4.243,1.758l-3,2.999 C8.625,6.891,8,8.397,8,10s0.624,3.109,1.757,4.242c0.49,0.49,1.052,0.878,1.659,1.169C11.792,15.034,12,14.532,12,14 c0-0.218-0.041-0.425-0.106-0.622c-0.258-0.155-0.503-0.332-0.721-0.55C10.417,12.072,10,11.068,10,10s0.416-2.073,1.171-2.829 l3-2.999C14.927,3.416,15.932,3,17,3s2.073,0.416,2.829,1.172C20.584,4.928,21,5.932,21,7s-0.416,2.072-1.171,2.828l-2.107,2.107 C17.9,12.601,18,13.292,18,14c0,0.162-0.012,0.322-0.021,0.482c0.089-0.079,0.18-0.155,0.265-0.24l3-3C22.376,10.109,23,8.603,23,7 S22.376,3.891,21.243,2.758z"></path>
                </g>
            </svg>
        </div>
    </div>
    `;

  gifContainer.appendChild(tempDiv.children[0]);
}

function copyUrlToClipboard(urlBtn) {
  let imgUrl = urlBtn.parentNode.getAttribute("data-url");
  hiddenInput.value = imgUrl;
  hiddenInput.select();
  hiddenInput.setSelectionRange(0, 99999);
  document.execCommand("copy");
}

function disableNextButton() {
  paginationElement.setAttribute("data-state", "hidden");
}

function enableNextButton() {
  paginationElement.setAttribute("data-state", "visible");
}

let data;
let main;
let counter = 0;
let button;

// fetching api
const httpGetAsync = (theUrl, callback) => {
  let xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      //console.log("Request Success.");
      callback(xmlHttp.responseText);
    }
  };

  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
};

// function to get the next group of gifs
const next = function () {
  try {
    // removing the next button
    disableNextButton();

    // loop for accessing next 10 gifs
    for (let j = 0; j <= 10; j++) {
      // maximux gifs count can be 50 so checking the count
      if (counter < 50) {
        // element
        const each_data_element = data[counter];

        //console.log(counter, JSON.stringify(each_data_element["media"][0]));

        /*
      
      Available formats :-
       • nanomp4
       • tinygif
       • tinymp4
       • gif
       • mp4
       • nanogif
       • mediumgif
       • loopedmp4
       • webm
       • tinywebm
       • nanowebm
      
      */

        // setting values
        let lqsrc = each_data_element["media"][0]["gif"]["url"];

        let hqsrc = each_data_element["media"][0]["gif"]["url"];

        addGif(lqsrc, hqsrc);

        // for counting the array elements
        counter++;
      }
    }

    // again appending the button if the macimum limit is not crossed
    if (counter < 50) {
      enableNextButton();
    }
  } catch (e) {}
};

// callback after getting the data
const tenorCallback_search = (responsetext) => {
  // console.log(responsetext);

  // response in tge form of array
  let response_objects = JSON.parse(responsetext);

  // not 10 but all placeholder name 😂😂
  let top_10_gifs = response_objects["results"];

  // external variable for accesing through console
  data = top_10_gifs;

  // clearing the section
  gifContainer.innerHTML = "";

  // appending first 10 gifs
  for (let i = 0; i <= 10; i++) {
    const element = top_10_gifs[i];
    counter++;

    // console.log(counter, element);
    let lqsrc = element["media"][0]["gif"]["url"];

    let hqsrc = element["media"][0]["gif"]["url"];

    addGif(lqsrc, hqsrc);
  }

  enableNextButton();
};

// search for data
const grab_data = (search_term) => {
  // updation of counter
  counter = 0;

  // api key not mine 😂😂
  let apikey = "LIVDSRZULELA";
  // maximum limit
  let lmt = 50;
  // range is size of the gif
  let range = "standard";

  // escaping spaces and characters
  search_term = encodeURI(search_term);
  //console.log(search_term);

  // finally searching it
  let search_url =
    "https://api.tenor.com/v1/search?" +
    "key=" +
    apikey +
    "&limit=" +
    lmt +
    "&ContentFilter=MEDIUM" +
    "&ar_range=" +
    range +
    "&media_filter=basic" +
    "&q=" +
    search_term;

  // console.log(search_url);

  // data search xhr
  httpGetAsync(search_url, tenorCallback_search);
};

const startsearch = (e) => {
  try {
    e.preventDefault();
  } catch (e) {}
  const qry = document.querySelector("#search-bar").value;
  // console.log("searrching.......");

  grab_data(qry);
};

const closePop = () => {
  const popContainer = document.querySelector("#pop-container");

  document.body.removeChild(popContainer);
};

// for setting events on load
window.onload = () => {
  // url params to search ?s=tmkoc
  const queryString = window.location.search;

  const param = new URLSearchParams(queryString);

  const s = param.get("s") || "hi";

  // searching for data
  grab_data(s);

  // A POP UP

  // Alert Box
  const popContainer = document.createElement("section");
  popContainer.id = "pop-container";

  const pop = document.createElement("div");
  pop.classList.add("pop");

  // Title box
  const title = document.createElement("p");
  title.classList.add("title");
  title.textContent = "Welcome";
  pop.appendChild(title);

  // Main Content Box
  const text = document.createElement("div");
  text.classList.add("text");

  const content = document.createElement("div");
  content.innerHTML =
    "All this code is open-source on Github. You can <a href='https://github.com/KrishAgarwal2811/gify-app/'>fork</a> this repo there and show your contribution.";
  text.appendChild(content);

  pop.appendChild(text);

  // Ok button box
  const btn = document.createElement("button");
  btn.textContent = "Okay";
  btn.addEventListener("click", closePop);
  pop.appendChild(btn);

  popContainer.appendChild(pop);

  document.body.insertAdjacentElement("afterbegin", popContainer);
};
