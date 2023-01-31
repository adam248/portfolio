var FULLSCREEN = false;

var ball_radius = 12.5;
var gravity = 0.1;

let balls = [];

function setup() {
  let [new_width, new_height] = get_canvas_size();
  var canvas = createCanvas(new_width, new_height);
  canvas.parent("canvas");
  canvas.mousePressed(toggle_fullscreen);

  title = createElement("h3", "Bouncing Balls");
  title.parent("creative-header");
  createP().parent("canvas");

  reset_button = createButton("Reset");
  reset_button.parent("canvas-controls");
  reset_button.addClass("btn");
  reset_button.addClass("btn-primary");
  reset_button.mousePressed(reset);

  noStroke();

  reset();
}

function toggle_fullscreen() {
  if (!FULLSCREEN) {
    resizeCanvas(windowWidth * 0.98, windowHeight * 0.95);
    FULLSCREEN = true;
    reset();
  } else {
    let [new_width, new_height] = get_canvas_size();
    resizeCanvas(new_width, new_height);
    FULLSCREEN = false;
    reset();
  }
  console.log();
}

function windowResized() {
  let [new_width, new_height] = get_canvas_size();
  resizeCanvas(new_width, new_height);
}

function get_canvas_size() {
  // old way ...
  // new_width = windowWidth - windowWidth * 0.2;
  // new_height = windowHeight * 0.5;
  // new way
  if (windowWidth > windowHeight) {
    // landscape
    new_width = windowHeight * 0.5;
    new_height = windowHeight * 0.5;
  } else {
    // portrait
    new_width = windowWidth * 0.5;
    new_height = windowWidth * 0.5;
  }
  return [new_width, new_height];
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
