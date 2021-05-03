// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById("user-image"); //canvas
const inputImage = document.getElementById("image-input"); //the inputted image
const context = canvas.getContext("2d"); //the context of the canvas
const clearButton = document.querySelector("[type='reset']"); //clear button
const readButton = document.querySelector("[type='button']"); //read button
const generate = document.querySelector("[type='submit']"); //generate button

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillstyle = "black"; //makes background black

  let dimension = getDimmensions(canvas.width, canvas.width, img.width, img.height);

  context.drawImage(img, dimension.startX, dimension.startY, dimension.width, dimension.height);
});

//Input: image-input
inputImage.addEventListener("change", () => {

  img.src = URL.createObjectURL(inputImage.files[0]); //sets image url to selected image
  img.alt = inputImage.value;
})

//function for writing memeText
function memeText() {
  let topText = document.getElementById("text-top").value;
  let bottomText = document.getElementById("text-bottom").value;

  context.fillStyle = "White"; //make font white
  context.font = "50px Comic Sans MS";

  let topDist = context.measureText(topText).width/2;
  let bottomDist = context.measureText(bottomText).width/2;

  let canvasWidth = canvas.width/2

  context.fillText(topText, canvasWidth - topDist, 60);
  context.fillText(bottomText, canvasWidth - bottomDist, canvas.height-25);
}

//form: submit
document.getElementById("generate-meme").addEventListener('submit', (event) => {
  memeText();

  clearButton.disabled = false;
  readButton.disabled = false;
  generate.disabled = true;
  //document.getElementById("voice-selection").disabled = false;

  //it kept refreshing so this stopped it
  event.preventDefault(); 
})

//button: clear
clearButton.addEventListener('click', (event) => {

  context.clearRect(0, 0, canvas.width, canvas.height);
  clearButton.disabled = true;
  readButton.disabled = true;
  generate.disabled = false;
  document.getElementById("voice-selection").disabled = true;
  context.fillStyle = "Black"; //makes it so that the background stays black and doesn't turn white
  document.getElementById("generate-meme").reset();
});

//button: read text
readButton.addEventListener("click", ()=> {
  let voiceChoice = document.getElementById("voice-selection");
  let topText = document.getElementById("text-top").value;
  let bottomText = document.getElementById("text-bottom").value;

  //speech utterance for the text
  let speakTop = new SpeechSynthesisUtterance(topText);
  let speakBottom = new SpeechSynthesisUtterance(bottomText);

  // For loop gotten from mozilla.org page on SpeechSynthesis
  for(var i = 0; i < voices.length ; i++) {
    //makes it read the meme with the seleted voice
    if(voices[i].name === voiceChoice.options[voiceChoice.selectedIndex].getAttribute('data-name')) {
      speakTop.voice = voices[i];
      speakBottom.voice = voices[i];
    }
  }

  speakTop.volume = volumeSlide.value / 100;
  speakBottom.volume = volumeSlide.value / 100;

  //clears the utterance queue just in case
  synth.cancel();
  
  synth.speak(speakTop);
  synth.speak(speakBottom);
});

/*
 * Line 103 - 125 gotten from mozila.org page on SpeechSynthesis
 */
document.getElementById("voice-selection").disabled = false; 
var synth = window.speechSynthesis;
var voices = [];

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById("voice-selection").appendChild(option);
  }
}

//volume slide
let volumeSlide = document.querySelector("[type='range']");
let volumeImg = document.querySelector("#volume-group img");
volumeSlide.addEventListener('input', ()=> {
  if (volumeSlide.value >= 67){ 
    volumeImg.src="icons/volume-level-3.svg"; 
  }
  else if (volumeSlide.value >= 34 && volumeSlide.value <= 66){
    volumeImg.src = "icons/volume-level-2.svg"; 
  }
  else if (volumeSlide.value <= 33 && volumeSlide.value > 0){ 
    volumeImg.src = "icons/volume-level-1.svg"; 
  }
  else {
    volumeImg.src="icons/volume-level-0.svg"; 
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
