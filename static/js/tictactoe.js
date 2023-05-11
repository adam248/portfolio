let TITLE = "Tic Tac Toe";

// Add all control elements to this for easy layout
let controls = [];

// declare project variables
let x, y;
let game;
let count = 0;

function restart() {
  // put your project specific setup code here for easy restarting
  game = new Game(new HumanPlayer(), new RandomPlayer());

  // slow motion
  //frameRate(1);

  loop();

  count = 0;
}

function draw() {
  // Try to not put anything in here that only needs to run once!

  // Initial Style (basic dark mode)
  background(0);
  fill(255);
  stroke(127);

  // how to draw a grid
  let DIMENSION = 3;
  for (let i = 1; i < DIMENSION; i++) {
    line((width / DIMENSION) * i, 0, (width / DIMENSION) * i, height);
    line(0, (height / DIMENSION) * i, width, (height / DIMENSION) * i);
  }

  game.play();

  // step through the cells array and drawing it
  game.board.forEach((cell) => {
    cell.show();
  });

  count++;
}
// PROJECT SPECIFIC CLASSES AND FUNCTIONS
//

function Cell(i) {
  let numberOfColumns = 3;
  let numberOfRows = 3;
  this.i = i;
  this.value = null;
  this.x = i % numberOfColumns;
  this.y = Math.floor(i / numberOfRows);

  this.textOrgin = createVector(
    (width / numberOfColumns) * this.x + width / numberOfColumns / 2,
    (height / numberOfRows) * this.y + height / numberOfRows / 2
  );

  this.show = () => {
    fill(127);
    textSize(72);
    textAlign(CENTER, CENTER);
    if (this.value) {
      text(this.value, this.textOrgin.x, this.textOrgin.y);
    }
  };
}

function RandomPlayer() {
  this.id = "Random: " + Math.floor(random(1000, 10000));
  this.play_turn = (game) => {
    console.log(this.id);
    available_moves = game.available_moves();
    chosen_move = random(available_moves);
    return chosen_move;
  };
}

function HumanPlayer() {
  this.id = "Human: " + Math.floor(random(0, 1000));
  this.play_turn = (game) => {
    console.log(this.id);
    // TODO: how to await a mouse click without blocking the draw loop
  };
}

function Game(player1, player2) {
  this.player1 = player1;
  this.player2 = player2;
  this.board = [];
  this.size = 3;
  this.winner = null;
  this.turn = 0;
  this.player1piece = "x";
  this.player2piece = "o";
  this.waiting_for_human_move = false;

  for (let i = 0; i < this.size * this.size; i++) {
    this.board.push(new Cell(i));
  }

  this.play = () => {
    console.log("Play");
    if (!this.game_is_over()) {
      if (this.turn % 2 == 0) {
        if (this.player1 instanceof HumanPlayer) {
          this.waiting_for_human_move = true;
        }
        this.move(this.player1.play_turn(this));
      } else {
        if (this.player2 instanceof HumanPlayer) {
          this.waiting_for_human_move = true;
        }
        this.move(this.player2.play_turn(this));
      }
    } else {
      console.log("Game over");
      noLoop();
      alert(`Game over: the winner is ${this.winner}`);
    }
  };

  this.game_is_over = () => {
    // check for win condition
    this.winner = this.win_condition();
    console.log("Winner: ", this.winner);
    if (this.winner) {
      return true;
    }
    // tie game (all squares filled but no 3 in a row)
    if (this.turn > 8) {
      return true;
    }

    // else the game can keep going
    return false;
  };

  this.win_condition = () => {
    // if there is a winner return the winning piece
    let row = [];
    let col = [];

    // check row & col
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // build row : 0 1 2 : 3 4 5 : 6 7 8
        row.push(this.board[i * 3 + j].value);
        // build col: 0 3 6 : 1 4 7 : 2 5 8
        col.push(this.board[i + j * 3].value);
      }

      // check for matches in row & col
      if (!row.includes(null) && allEqual(row)) {
        return row[0];
      }
      if (!col.includes(null) && allEqual(col)) {
        return col[0];
      }

      // clear row and col
      row = [];
      col = [];
    }

    // check diagonals
    let diags = [[], []];
    for (let i = 0; i < 3; i++) {
      // 0 4 8 : * 4
      diags[0].push(this.board[i * 4].value);

      // 2 4 6 : * 2 + 2
      diags[1].push(this.board[i * 2 + 2].value);
    }

    if (!diags[0].includes(null) && allEqual(diags[0])) {
      return diags[0][0];
    }
    if (!diags[1].includes(null) && allEqual(diags[1])) {
      return diags[1][0];
    }

    return false;
  };

  this.available_moves = () => {
    empty_cells = [];
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i].value == null) {
        empty_cells.push(i);
      }
    }
    return empty_cells;
  };

  this.move = (index) => {
    if (this.waiting_for_human_move) {
      return;
    }
    if (this.turn % 2 == 0) {
      this.board[index].value = this.player1piece;
      this.turn += 1;
    } else {
      this.board[index].value = this.player2piece;
      this.turn += 1;
    }
  };

  this.place_move_with_mouse = (mouse_x, mouse_y) => {
    let vec = createVector(
      Math.floor(mouseX / (width / 3)),
      Math.floor(mouseY / (height / 3))
    );

    const chosen_move = this.vec2Index(vec);

    if (this.available_moves().includes(chosen_move)) {
      this.waiting_for_human_move = false;
      this.move(this.vec2Index(vec));
    }
  };

  this.show = () => {
    this.board.forEach((cell) => {
      cell.show();
    });
  };

  this.index2Vec = (index) => {
    return createVector(index % this.size, Math.floor(index / this.size));
  };

  this.vec2Index = (vec) => {
    return vec.x + vec.y * this.size;
  };
}

//
// ------------ BOILERPLATE BELOW --------------------------

function setup() {
  setupCanvas();
  setPageTitle();

  createCtrlButtons();
  setupControls();

  restart();
}

function setupCanvas() {
  // Initialize Canvas
  let [new_width, new_height] = get_canvas_size();
  var canvas = createCanvas(new_width, new_height);
  canvas.parent("canvas");

  // default mouse press on canvas to toggle fullscreen
  canvas.mousePressed(markCell);
}

function markCell() {
  // mark which cell that was clicked
  let vec = createVector(
    Math.floor(mouseX / (width / 3)),
    Math.floor(mouseY / (height / 3))
  );

  game.place_move_with_mouse(mouseX, mouseY);
}

function setPageTitle() {
  // Set Page Title
  let title = createElement("h3", TITLE);
  title.parent("creative-header");
}

function windowResized() {
  let [x, y] = get_canvas_size();
  resizeCanvas(x, y);
}

function createCtrlButtons() {
  reset_button = createButton("Reset");
  reset_button.addClass("btn");
  reset_button.addClass("btn-primary");
  reset_button.mousePressed(restart);
  controls.push(reset_button);
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

const allEqual = (arr) => arr.every((val) => val === arr[0]);
