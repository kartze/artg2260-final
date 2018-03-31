let playTime;
let scene = 0;
let r = 0;
let g = 255;
let b = 0;
var img;
var rotSpeed = .01
var x = 700
var z = 0 
var y = 0
var rad = 700 

function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight - 70, WEBGL);
  canvas.parent('sketch-box');
  img = loadImage("img/earth1.jpg");
}

function draw() {
 background(12, 36, 97);
  fill(r, g, b);
  translate(0, 0);
  orbitControl();
  camera( cos(rotSpeed)* rad, y, sin(rotSpeed)* rad, 0, 0, 0, 0, 1, 0);
  texture(img);
  sphere(250);
  //x++;
  //z++;
  rotSpeed+= 0.01;

}


// click the Earth to start
//function mousePressed() {

// camera( x * cos(rotSpeed) - y * sin(rotSpeed), y * cos(rotSpeed) + x * sin(rotSpeed), z, 0, 0, 0, 0, 1, 0);