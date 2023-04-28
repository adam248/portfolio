// THIS IS A TEMPLATE FILE FOR MY P5.js demos
let TITLE = "Tic Tac Toe";

// Add all control elements to this for easy layout
let controls = [];

function setupControls() {
  controls.forEach((ctrl, idx) => {
    ctrl.parent("canvas-controls");
    ctrl.style("margin", "10px");
  });
}

let game = new Board();

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
  let [x, y] = get_canvas_middle();

  // Initial Styles
  background(0);

  console.table(game);
  game.show();
  noLoop();
}

// TicTacToe

function Cell(x, y, i) {
  this.x = x;
  this.y = y;
  this.i = i;
  this.value = "o"; // xo     XO       ⭕❌     🛡⚔

  this.show = () => {
    fill(255);
    textFont("Courier");
    textSize(72);
    textAlign(CENTER, CENTER);
    text(
      this.value,
      (width / 6) * (1 + this.x) + (width / 6) * this.x,
      (height / 6) * (1 + this.y) + (height / 6) * this.y
    );
  };
}

function Board() {
  this.board = [];
  // prettier-ignore
  for (let i = 0; i < 9; i++) {
    let x = i % 3;
    let y = Math.floor(i / 3); 
    this.board.push(new Cell(x, y, i));
  }
  this.show = () => {
    // draw board grid
    stroke(255);
    for (let i = 1; i < 3; i++) {
      line((width / 3) * i, 0, (width / 3) * i, height);
      line(0, (height / 3) * i, width, (height / 3) * i);
    }
    this.board.forEach((cell) => {
      cell.show();
    });
  };
}

// Utils

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
  return [400, 400];
}

function get_canvas_middle() {
  let [x, y] = get_canvas_size();
  return [x / 2, y / 2];
}
