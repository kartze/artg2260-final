var slideNumber;

function setup() {
  size(800, 600);
  slideNumber = 0;  
}

function draw() {
  background(0);
  
  if (slideNumber == 0) {
    rect(10, 10, 50, 40);

  }
  
  else if (slideNumber == 1) {
    ellipse(20, 40, 20, 20);
  }

    else if (slideNumber == 2) {
    ellipse(40, 50, 20, 20);

  }

    else if (slideNumber == 3) {
    ellipse(60, 50, 20, 20);

  }

    else if (slideNumber == 4) {
    ellipse(19, 30, 20, 20);

  }
}

void keyPressed() {
  slideNumber++;
}