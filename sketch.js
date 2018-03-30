let b;
let song;
let on = 1;

function preload() {
  song = loadSound("getlucky.mp3");
}

function setup() {
  var canvas = createCanvas(400, 400);
  canvas.parent('sketch-box');
  b = new Box();
  song.play();
}

function draw() {
  if (on == 1) {
    update();
  } else if (on == 2) {
    paused();
  }
}

function update() {
  background(0);
  b.display();
  b.move();
  b.teleport();
}

function paused() {
  background(0);
  b.display();
}

function keyPressed() {
  if (key == "d" || key == "D") {
    if (song.isPlaying()) { // .isPlaying() returns a boolean
      song.pause(); // .play() will resume from .pause() position
      on = 2;
    } else {
      song.play();
      on = 1;
    }
  }
}

class Box {
  constructor() {
    this.x = 175;
    this.y = 350;
    this.width = 50;
    this.height = 50;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  display() {
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.y--;
  }

  teleport() {
    if (this.y == 0) {
      this.y = 350;
      this.r = random(255);
      this.g = random(255);
      this.b = random(255);
      fill(this.r, this.g, this.b);
    }
  }
}