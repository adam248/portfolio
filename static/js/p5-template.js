// THIS IS A TEMPLATE FILE FOR MY P5.js demos
let TITLE = "PLACEHOLDER TITLE";

// Add all control elements to this for easy layout
let controls = [];

function setupControls() {
  controls.forEach((ctrl, idx) => {
    ctrl.parent("canvas-controls");
    ctrl.style("margin", "10px");
  });
}

// if the demo breaks the user can always restart it
function reset() {}

function setup() {
  // Initialize Canvas
  let [new_width, new_height] = get_canvas_size();
  var canvas = createCanvas(new_width, new_height);
  canvas.parent("canvas");

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
  background(0);
  noStroke();
  fill(0, 255, 0); // Green
  describe("pink square with red heart in the bottom right corner");
  fill("red");
  noStroke();
  ellipse(67, 67, 20, 20);
  ellipse(83, 67, 20, 20);
  triangle(91, 73, 75, 95, 59, 73);

  let [x, y] = get_canvas_middle();

  ellipse(x, y, 50, 50);
}

function mousePressed() {
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
