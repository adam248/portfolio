let TITLE = "Starfield";
let FULLSCREEN = false;

// Add all control elements to this for easy layout
let controls = [];

let numberOfObjects = 500;
let objects = [];

function setupControls() {
  controls.forEach((ctrl, idx) => {
    ctrl.parent("canvas-controls");
    ctrl.style("margin", "10px");
  });
}

// if the demo breaks the user can always restart it
function reset() {
  numberOfObjects = width * 10;
  // MySetupFunction All creation happens here
  for (let i = 0; i < numberOfObjects; i++) {
    objects[i] = new Star();
  }
}

function render() {
  // MyDrawFunction All the objects in the `objects` array are drawn
  for (let i = 0; i < numberOfObjects; i++) {
    objects[i].update();
    objects[i].draw();
  }
}

function setup() {
  // Initialize Canvas
  let [new_width, new_height] = get_canvas_size();
  var canvas = createCanvas(new_width, new_height);
  canvas.parent("canvas");
  canvas.mousePressed(mouse_press);

  // Set Page Title
  title = createElement("h3", TITLE);
  title.parent("creative-header");

  // Create Controls
  reset_button = createButton("Reset");
  reset_button.addClass("btn");
  reset_button.addClass("btn-primary");
  reset_button.mousePressed(reset);
  controls.push(reset_button);

  // Build
  setupControls();
  reset();
}

function draw() {
  // Try to not put anything in here that only needs to run once!

  // Initial Styles
  background(0, 75);

  // set mid point as the reference
  translate(width / 2, height / 2);

  render();
}

function mouse_press() {
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
  // old way
  return [
    Math.min(windowWidth - windowWidth * 0.2, 1920),
    Math.min(windowHeight * 0.5, 1080),
  ];
}

function get_canvas_middle() {
  let [x, y] = get_canvas_size();
  return [x / 2, y / 2];
}

class Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);
  }

  update() {
    this.acceleration = (width * height) / 100000;
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
