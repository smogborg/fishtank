var palette;

//To insert webcam, it's like ure looking inside the tank
let video;

let fishgroup = [];
let fish = [];
let bubbles = [];
let counter = 0;
let audioStarted = false;

//For-Loop + String Concatentation to load multiple images
function preload() {
  for (let i = 0; i < 5; i++) {
    fish[i] = loadImage("fishes/fish" + i + ".png");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  // Slider to change circle size 
  s1 = createSlider(10, 50, 15, 5).position(10, 10);

  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(50, 300);
    let b = new Fishgroup(x, y, r);
    fishgroup.push(b);
  }

  // A palette for the background
  rainbow = [
    color("#3F07F5"),
    color("#1840F5"),
    color("#C0FD51"),
    color("#75FB96"),
    color("#FDFA52"),
    color("#EA3323"),
    color("#EA3392"),
  ];

  // Attempt to start the AudioContext on user gesture
  userStartAudio().then(() => {
    console.log("AudioContext started successfully");
    audioStarted = true;
  }).catch((error) => {
    console.error("Error starting AudioContext:", error);
  });
}

function draw() {
  background(rainbow[counter]);

  let gridSize = s1.value();

  // Takes pixels of the video and loads them
  video.loadPixels();
  for (let y = 0; y < video.height; y += gridSize) {
    for (let x = 0; x < video.width; x += gridSize) {
      let index = (y * video.width + x) * 4;
      let r = video.pixels[index];
      let dia = map(r, 0, 255, gridSize, 2);

      fill(255);
      circle(x + gridSize / 2, y + gridSize / 2, dia);
    }
  }

  for (let i = 0; i < fishgroup.length; i++) {
    fishgroup[i].move();
    fishgroup[i].show();
  }

  let B = new Bubble();
  bubbles.push(B);
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].update();
    bubbles[i].show();
  }

  if (!audioStarted) {
    fill(255, 0, 0);
    textSize(20);
    text("Click anywhere to start audio", 50, height / 2);
  }
}

function keyPressed() {
  counter++;
  if (counter > 6) {
    counter = 0;
  }
}

// Changes fish once pressed on
function mousePressed() {
  userStartAudio(); // Start AudioContext on mouse press

  for (let i = 0; i < fishgroup.length; i++) {
    fishgroup[i].clicked(mouseX, mouseY);
  }
}

class Fishgroup {
  constructor(x, y, r, img) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.fish = random(fish);
  }

  clicked(px, py) {
    if (
      px > this.x &&
      px < this.x + this.r &&
      py > this.y &&
      py < this.y + this.r
    ) {
      this.fish = random(fish);
    }
  }

  move() {
    this.x = this.x - 1;
    if (this.x < -100) {
      this.x = width;
    }
    this.y = this.y + random(-2, 2);
  }

  show() {
    image(this.fish, this.x, this.y, this.r, this.r);
  }
}

// The bubble particles
class Bubble {
  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.vx = random(-1, 1);
    this.vy = random(-5, -1);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  show() {
    strokeWeight(3);
    stroke(255);
    noFill();
    ellipse(this.x, this.y, 10);
  }
}

