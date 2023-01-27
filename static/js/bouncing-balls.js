var canvas_width = 600;
var canvas_height = 400;

var ball_radius = 12.5;
var gravity = 0.1;

let balls = [];

function setup() {
  // createCanvas(windowWidth - 20, windowHeight - windowWidth);
  var canvas = createCanvas(
    windowWidth - windowWidth * 0.2,
    windowHeight * 0.5
  );
  canvas.parent("canvas");

  title = createElement("h3", "Bouncing Balls!");
  title.parent("creative-header");
  createP().parent("creative-header");
  createP().parent("canvas");

  reset_button = createButton("Reset");
  reset_button.parent("canvas");
  reset_button.addClass("btn");
  reset_button.addClass("btn-primary");
  reset_button.mousePressed(reset);

  noStroke();

  reset();
  createP().parent("canvas");
}

function windowResized() {
  // resizeCanvas(windowWidth, windowHeight);
  resizeCanvas(windowWidth - windowWidth * 0.2, windowHeight * 0.5);
}

function reset() {
  balls = [];
  for (let i = 0; i < 5; i++) {
    balls.push(
      new Ball(
        createVector(random(width), random(height)),
        p5.Vector.random2D().mult(random(10)),
        ball_radius,
        color(0, 255, 0)
      )
    );
  }
}

function draw() {
  background(3);

  for (let i = 0; i < balls.length; i++) {
    for (let j = 0; j < i; j++) {
      balls[i].collide(balls[j]);
    }
  }

  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].draw();
  }
}

class Ball {
  constructor(pos, vel, radius, color) {
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.color = color;
  }
  collide(other) {
    if (other == this) {
      return;
    }
    let relative = p5.Vector.sub(other.pos, this.pos);
    let distance = relative.mag() - (this.radius + other.radius);

    if (distance < 0) {
      let movement = relative.copy().setMag(abs(distance / 2));
      this.pos.sub(movement);
      other.pos.add(movement);

      let thisToOtherNormal = relative.copy().normalize();
      let approachSpeed =
        this.vel.dot(thisToOtherNormal) + -other.vel.dot(thisToOtherNormal);
      let approachVector = thisToOtherNormal.copy().setMag(approachSpeed);
      this.vel.sub(approachVector);
      other.vel.add(approachVector);
    }
  }
  move() {
    this.vel.y += gravity;

    this.pos.add(this.vel);

    if (this.pos.x < this.radius) {
      this.pos.x = this.radius;
      this.vel.x *= -1;
    }

    if (this.pos.x > width - this.radius) {
      this.pos.x = width - this.radius;
      this.vel.x *= -1;
    }

    if (this.pos.y < this.radius) {
      this.pos.y = this.radius;
      this.vel.y *= -1;
    }

    if (this.pos.y > height - this.radius) {
      this.pos.y = height - this.radius;
      this.vel.y *= -1;
    }
  }
  draw() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}
