let TITLE = "Starfield";
let FULLSCREEN = false;

// Add all control elements to this for easy layout
let controls = [];

let numberOfObjects = 500;
let objects = [];

let numberOfBackgroundStars = 500;
let backgroundStars = [];

let speed;

function setupControls() {
  controls.forEach((ctrl, idx) => {
    ctrl.parent("canvas-controls");
    ctrl.style("margin", "10px");
    ctrl.addClass("btn");
    ctrl.addClass("btn-primary");
  });
}

// if the demo breaks the user can always restart it
function reset() {
  numberOfObjects = width * 2;
  numberOfBackgroundStars = width * 2;
  speed = compute_speed();
  console.log(speed);
  // MySetupFunction All creation happens here
  for (let i = 0; i < numberOfObjects; i++) {
    objects[i] = new Star();
  }
  for (let i = 0; i < numberOfBackgroundStars; i++) {
    backgroundStars[i] = new BackgrounStar();
  }
}

function render() {
  // MyDrawFunction All the objects in the `objects` array are drawn
  for (let i = 0; i < numberOfBackgroundStars; i++) {
    backgroundStars[i].draw();
  }
  for (let i = 0; i < numberOfObjects; i++) {
    objects[i].update();
    objects[i].draw();
  }
}

function increase_speed() {
  speed *= 1.1;
}

function decrease_speed() {
  speed /= 1.1;
}

function setup() {
  // Initialize Canvas
  let [new_width, new_height] = get_canvas_size();
  var canvas = createCanvas(new_width, new_height);
  canvas.parent("canvas");
  canvas.mousePressed(toggle_fullscreen);

  // Set Page Title
  title = createElement("h3", TITLE);
  title.style("margin: 20px;");
  title.parent("creative-header");

  // Create Controls
  increase_speed_button = createButton();
  increase_speed_button.html('<i class="bi bi-plus"></i>');
  increase_speed_button.mousePressed(increase_speed);
  controls.push(increase_speed_button);

  reset_button = createButton("Reset");
  reset_button.mousePressed(reset);
  controls.push(reset_button);

  decrease_speed_button = createButton();
  decrease_speed_button.html('<i class="bi bi-dash"></i>');
  decrease_speed_button.mousePressed(decrease_speed);
  controls.push(decrease_speed_button);

  speed = compute_speed();

  // Build
  setupControls();
  reset();
}

function compute_speed() {
  return (width * height) / (width + height) / 100;
}

function draw() {
  // Try to not put anything in here that only needs to run once!

  // Initial Styles
  background(0, 75);

  // set mid point as the reference
  translate(width / 2, height / 2);

  render();
}

function toggle_fullscreen() {
  if (!FULLSCREEN) {
    resizeCanvas(windowWidth * 0.98, windowHeight * 0.95);
    FULLSCREEN = true;
    let previous_speed = speed;
    reset();
    speed = previous_speed;
  } else {
    let [new_width, new_height] = get_canvas_size();
    resizeCanvas(new_width, new_height);
    FULLSCREEN = false;
    let previous_speed = speed;
    reset();
    speed = previous_speed;
  }
}

function windowResized() {
  let [x, y] = get_canvas_size();
  resizeCanvas(x, y);
}

function get_canvas_size() {
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

function get_canvas_middle() {
  let [x, y] = get_canvas_size();
  return [x / 2, y / 2];
}

class BackgrounStar {
  constructor() {
    this.x = random(-width / 2, width / 2);
    this.y = random(-height / 2, height / 2);
    this.r = random(0, 1);
    this.color = random(255);
  }

  draw() {
    noStroke();
    if (random(10) >= 9.5) {
      // twinkle the star
      fill(random(255));
    } else {
      // draw the star's normal brightness
      fill(this.color);
    }

    ellipse(this.x, this.y, this.r, this.r);
  }
}

class Star {
  constructor() {
    this.x = random(-width / 2, width / 2);
    this.y = random(-height / 2, height / 2);
    this.z = random(width);
  }

  update() {
    this.acceleration = speed;
    this.z -= this.acceleration;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width, width);
      this.y = random(-height, height);
    }
  }

  draw() {
    noStroke();
    fill(255);

    this.sx = map(this.x / this.z, 0, 1, 0, width);
    this.sy = map(this.y / this.z, 0, 1, 0, height);

    let r = map(this.z, 0, width, 10, 0);

    ellipse(this.sx, this.sy, r, r);
  }
}
