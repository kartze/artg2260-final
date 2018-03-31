let playTime;
let scene = 0;
let r = 0;
let g = 255;
let b = 0;
var img1, img2;
let x, y, z;
let s = 0.5, t = 0.0;
let dt = 0.0002, ds = 0.0002;
let rad = 350; 


function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight - 70, WEBGL);
  canvas.parent('sketch-box');
  img1 = loadImage("img/earth1.jpg");
  img2 = loadImage("img/earth2.jpg")
}

function draw() {
 background(12, 36, 97);
  fill(r, g, b);
  translate(0, 0);
  orbitControl();

  // trig formula for 3D world coordinate position on a sphere 
  // to understand the math behind this see https://stackoverflow.com/questions/969798/plotting-a-point-on-the-edge-of-a-sphere
  x = rad * cos(s) * sin(t);
  y = rad * sin(s) * sin(t);
  z = rad * cos(t);

  // where we're looking at, controlled by cursor 
  let focalX = map(mouseX, 0, width, rad, -rad);
  let focalY = map(mouseY, 0, height, rad, -rad);
  
  camera(x, y, z, focalX, focalY, 0, 1, -1, 1);
  
  gl = this._renderer.GL;
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  texture(img);
  sphere(250, 48, 32);

  // update angles
  s += ds;
  t += dt;

  // make sure angles stay between 0 and 2*PI
  s = s % (2*PI);
  t = t % (2*PI);

  if(s < 0) s = 2*PI;
  if(t< 0) t = 2*PI;
  //console.log(t);
}

// pressing arrows reverses rotation angles
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    ds = 0.0002;
  } else if (keyCode === RIGHT_ARROW) {
    ds = -0.0002;
  } else if (keyCode === UP_ARROW) {
    dt = -0.0002;
  } else if (keyCode === DOWN_ARROW) {
    dt = 0.0002;
  }
}
