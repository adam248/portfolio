// THIS IS A TEMPLATE FILE FOR MY P5.js demos
let TITLE = "PLACEHOLDER TITLE";
let FULLSCREEN = false;
let PAUSED = true;

// Add all control elements to this for easy layout
let controls = [];

// declare project variables
let x, y;
let cells = [];
let index = 0;

function restart() {
  // put your project specific setup code here for easy restarting
  [x, y] = get_canvas_middle();

  // slow motion
  frameRate(1);

  // restart the loop just in case it is paused
  PAUSED = false;
  loop();

  // create new array
  for (let i = 0; i < 16; i++) {
    cells.push(new Cell(i));
  }
  index = 0;
}

function draw() {
  // Try to not put anything in here that only needs to run once!

  // Initial Style (basic dark mode)
  background(0);
  fill(255);
  stroke(127);

  // how to draw a grid
  for (let i = 1; i < 4; i++) {
    line((width / 4) * i, 0, (width / 4) * i, height);
    line(0, (height / 4) * i, width, (height / 4) * i);
  }

  // how to draw text
  textSize(42);
  fill(255);
  textAlign(CENTER, CENTER);
  let t = "Hello world";
  text(t, x, y);
  t = t + "!";

  // step through the cells array and drawing it
  cells[index].show();
  if (index == cells.length - 1) {
    index = 0;
  } else {
    index += 1;
  }

  // for testing the first pass draw
  if (PAUSED) {
    noLoop(); // for easy debuging
  }
}
// PROJECT SPECIFIC CLASSES AND FUNCTIONS
//

function Cell(i) {
  let numberOfColumns = 4;
  let numberOfRows = 4;
  this.i = i;
  this.x = i % numberOfColumns;
  this.y = Math.floor(i / numberOfRows);

  this.pos = createVector(
    (width / numberOfColumns) * this.x + width / numberOfColumns / 2,
    (height / numberOfRows) * this.y + height / numberOfRows / 2
  );

  this.show = () => {
    fill(127);
    textSize(42);
    textAlign(CENTER, CENTER);
    text(this.i, this.pos.x, this.pos.y);
  };
}

function myFunction() {}

//
// ------------ BOILERPLATE BELOW --------------------------

function setup() {
  setupCanvas();
  setPageTitle();

  createCtrlButtons();
  setupControls();

  restart();
}

function toggleFullscreen() {
  if (!FULLSCREEN) {
    resizeCanvas(windowWidth * 0.98, windowHeight * 0.95);
    FULLSCREEN = true;
    restart();
  } else {
    let [new_width, new_height] = get_canvas_size();
    resizeCanvas(new_width, new_height);
    FULLSCREEN = false;
    restart();
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
  let [x, y] = [width / 2, height / 2];
  return [x, y];
}

function setupControls() {
  controls.forEach((ctrl, idx) => {
    ctrl.parent("canvas-controls");
    ctrl.style("margin", "10px");
  });
}

function setupCanvas() {
  // Initialize Canvas
  let [new_width, new_height] = get_canvas_size();
  var canvas = createCanvas(new_width, new_height);
  canvas.parent("canvas");

  // default mouse press on canvas to toggle fullscreen
  canvas.mousePressed(toggleFullscreen);
}

function setPageTitle() {
  // Set Page Title
  title = createElement("h3", TITLE);
  title.parent("creative-header");
}

function createCtrlButtons() {
  reset_button = createButton("Reset");
  reset_button.addClass("btn");
  reset_button.addClass("btn-primary");
  reset_button.mousePressed(restart);
  controls.push(reset_button);

  toggleLoop_button = createButton("Pause");
  toggleLoop_button.addClass("btn");
  toggleLoop_button.addClass("btn-primary");
  toggleLoop_button.mousePressed(() => {
    noLoop();
    PAUSED = true;
  });
  controls.push(toggleLoop_button);

  redraw_button = createButton("Redraw");
  redraw_button.addClass("btn");
  redraw_button.addClass("btn-primary");
  redraw_button.mousePressed(() => {
    redraw();
  });
  controls.push(redraw_button);
}
