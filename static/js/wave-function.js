let TITLE = "Wave Function Collapse";

let FULLSCREEN = false;
let IS_SQUARE_CANVAS = true;

// Add all control elements to this for easy layout
let controls = [];

function setupControls() {
  controls.forEach((ctrl, idx) => {
    ctrl.parent("canvas-controls");
    ctrl.style("margin", "10px");
  });
}

const tiles = [];

let grid = [];

const DIMENSION = 20;

// enums
const TILENAME = ["BLANK", "UP", "RIGHT", "DOWN", "LEFT"];

const T = {
  BLANK: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4,
};

const JOIN = {
  BLANK: 0,
  LINE: 1,
};

const DIR = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

const RULES = {
  [T.BLANK]: [0, 0, 0, 0],
  [T.UP]: [1, 1, 0, 1],
  [T.RIGHT]: [1, 1, 1, 0],
  [T.DOWN]: [0, 1, 1, 1],
  [T.LEFT]: [1, 0, 1, 1],
};

function preload() {
  tiles[0] = loadImage("/static/js/tiles/demo/blank.png");
  tiles[1] = loadImage("/static/js/tiles/demo/up.png");
  tiles[2] = loadImage("/static/js/tiles/demo/right.png");
  tiles[3] = loadImage("/static/js/tiles/demo/down.png");
  tiles[4] = loadImage("/static/js/tiles/demo/left.png");
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

function Cell(i) {
  this.i = i;
  this.collapsed = false;
  //this.options = [T.BLANK, T.UP, T.RIGHT, T.DOWN, T.LEFT];
  this.options = [0, 1, 2, 3, 4];
  this.connections = [null, null, null, null];
  this.update_options = () => {
    let option_set = new Set(this.options);
    for (let option of this.options) {
      for (let dir = 0; dir < 4; dir++) {
        if (
          this.connections[dir] != null &&
          RULES[option][dir] != this.connections[dir]
        ) {
          option_set.delete(option);
        }
      }
    }
    this.options = Array.from(option_set);
  };
}

// if the demo breaks the user can always restart it
function reset() {
  // setup grid
  for (let i = 0; i < DIMENSION * DIMENSION; i++) {
    grid[i] = new Cell(i);
  }
  loop();
}

function draw() {
  background(0);

  // Pick cell with least entropy
  let gridCopy = grid.slice();

  gridCopy.sort((a, b) => {
    return a.options.length - b.options.length;
  });

  // trim all that have been collapsed already
  gridCopy = gridCopy.filter((cell) => !cell.collapsed);

  // filter for lowest entropy
  gridCopy = gridCopy.filter((cell) => {
    return cell.options.length == gridCopy[0].options.length;
  });
  if (gridCopy.length > 0) {
    // pick next cell to collapse
    const cell = random(gridCopy);
    if (cell.options.length == 0) {
      console.error("Cell", cell.i, "'s options are empty!");
      reset();
    }
    cell.collapsed = true;
    cell.options = [random(cell.options)];
    console.log("Picked Cell:", cell.i, "Tile:", TILENAME[cell.options[0]]);
    cell.connections = RULES[cell.options[0]];
  }

  // draw the board
  const w = width / DIMENSION;
  const h = height / DIMENSION;
  for (let j = 0; j < DIMENSION; j++) {
    for (let i = 0; i < DIMENSION; i++) {
      let cell = grid[i + j * DIMENSION];
      if (cell.collapsed) {
        noStroke();
        let index = cell.options[0];
        image(tiles[index], i * w, j * h, w, h);
      } else {
        fill(0);
        stroke(255);
        rect(i * w, j * h, w, h);
      }
    }
  }

  // calculate the next entropy
  const nextGrid = [];
  for (let j = 0; j < DIMENSION; j++) {
    for (let i = 0; i < DIMENSION; i++) {
      let index = i + j * DIMENSION;
      let current = grid[index];
      if (current.collapsed) {
        nextGrid[index] = current;
      } else {
        // get connection from above cell or null
        if (j > 0) {
          // not on the top row
          let cell_above = grid[i + (j - 1) * DIMENSION];
          if (cell_above.collapsed) {
            current.connections[DIR.UP] =
              RULES[cell_above.options[0]][DIR.DOWN];
          }
        }
        // get connection from cell to the right
        if (i < DIMENSION - 1) {
          let next_cell = grid[i + 1 + j * DIMENSION];
          if (next_cell.collapsed) {
            current.connections[DIR.RIGHT] =
              RULES[next_cell.options[0]][DIR.LEFT];
          }
        }
        // get connection from cell below
        if (j < DIMENSION - 1) {
          let next_cell = grid[i + (j + 1) * DIMENSION];
          if (next_cell.collapsed) {
            current.connections[DIR.DOWN] = RULES[next_cell.options[0]][DIR.UP];
          }
        }
        // get connection from cell to the left
        if (i > 0) {
          let next_cell = grid[i - 1 + j * DIMENSION];
          if (next_cell.collapsed) {
            current.connections[DIR.LEFT] =
              RULES[next_cell.options[0]][DIR.RIGHT];
          }
        }

        current.update_options();
        nextGrid[index] = current;
      }
    }
  }

  grid = nextGrid;

  // completion logic
  is_all_collapsed =
    grid.filter((cell) => {
      return !cell.collapsed;
    }).length == 0;
  if (is_all_collapsed) {
    console.error("Finished!");
    noLoop();
  }
}

function mouse_press() {
  loop();
  if (!FULLSCREEN) {
    if (IS_SQUARE_CANVAS) {
      let new_size = Math.min(windowWidth * 0.98, windowHeight * 0.95);
      let new_width = new_size;
      let new_height = new_size;

      resizeCanvas(new_width, new_height);
    } else {
      resizeCanvas(windowWidth * 0.98, windowHeight * 0.95);
    }
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
  // TODO make this more dynamically set
  // override canvas size while testing
  // random thought: if a screen res is very big you can assume that it has more
  // processing power?
  return [new_width, new_height];
}

function get_canvas_middle() {
  let [x, y] = get_canvas_size();
  return [x / 2, y / 2];
}
