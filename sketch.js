let playTime;
let scene = 0;
let r = 0;
let g = 255;
let b = 0;

function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight - 70, WEBGL);
  canvas.parent('sketch-box');
}

function draw() {
  background(12, 36, 97);
  if (scene == 0) {
    startScreen();
  } else if (scene == 1) {
    update();
  } else if (scene == 2) {
    finScreen();
  }
}

function startScreen() {
  background(12, 36, 97);
  fill(r, g, b);
  translate(0, 0);
  orbitControl();
  sphere(250);
}

// click the Earth to start
//function mousePressed() {

//}