// global constants & variables
let width = 450;
let height = 450;

const NUM_OF_COLS = 9;
const NUM_OF_ROWS = 9;

const CELL_WIDTH = width / NUM_OF_COLS;
const CELL_HEIGHT = height / NUM_OF_ROWS;

var sudoku_board = [];

let current;
let stack = [];

// prettier-ignore
var prefilled_sudoku_board = [
  0,0,0, 0,0,2, 0,0,0,
  0,3,0, 0,5,0, 0,0,0,
  0,0,0, 0,0,0, 5,0,7,
  
  1,0,0, 0,0,0, 0,0,0,
  0,5,0, 0,0,0, 0,4,0,
  0,0,0, 0,9,0, 0,0,0,
  
  0,0,6, 0,0,0, 0,0,0,
  0,0,0, 5,0,0, 0,0,0,
  0,0,5, 0,0,0, 8,0,0,
];

function setup() {
  let canvas = createCanvas(width, height);
  canvas.parent("canvas");
  stroke(255);

  let x, y;

  for (let i = 0; i < 81; i++) {
    x = CELL_WIDTH * (i % 9);
    y = CELL_HEIGHT * Math.floor(i / 9);
    sudoku_board[i] = new Cell(x, y, i, prefilled_sudoku_board[i]);
  }
  current = sudoku_board[0];
}

function draw() {
  background(51);

  for (let i = 0; i < 81; i++) {
    sudoku_board[i].show();
  }

  // draw section lines
  stroke(180);
  strokeWeight(3.3);
  for (let i = 1; i < 3; i++) {
    line(CELL_WIDTH * 3 * i, 0, CELL_WIDTH * 3 * i, height);
    line(0, CELL_HEIGHT * 3 * i, width, CELL_HEIGHT * 3 * i);
  }

  // solve loop
  if (current == undefined) {
    console.log("Finished!");
    noLoop();
  } else if (current.num == 0) {
    if (current.next < 10) {
      if (solve(current, sudoku_board)) {
        stack.push(current);
        current = sudoku_board[current.i + 1];
      } else {
        current.next = 0;
        current.num = 0;
        current = stack.pop();
        current.num = 0;
      }
    } else {
      current.next = 0;
      current.num = 0;
      current = stack.pop();
      current.num = 0;
    }
  } else {
    current = sudoku_board[current.i + 1];
  }
}

function solve(cell, board) {
  cell.next += 1;
  if (is_valid(board, cell, cell.next)) {
    // set the cell
    cell.num = current.next; // solve
    return true;
  } else if (cell.next < 10) {
    // try again
    return solve(cell, board);
  }
  return false;
}

class Cell {
  constructor(x, y, i, num) {
    this.x = x; // drawing x
    this.y = y; // drawing y
    this.i = i; // index
    this.num = num; // range 0..=9
    this.next = 0; // loop 1..=9
    this.color = [255];
    this.b_color = [127];

    this.show = function () {
      // draw the cell border
      noFill();
      stroke(...this.b_color);
      strokeWeight(1);
      rect(this.x, this.y, CELL_WIDTH, CELL_HEIGHT);
      // draw the cell contents
      fill(...this.color);
      noStroke();
      textSize(CELL_WIDTH / 3 + CELL_HEIGHT / 3);
      textAlign(CENTER, CENTER);
      if (this.num != 0) {
        text(this.num, this.x + CELL_WIDTH / 2, this.y + CELL_HEIGHT / 2);
      }
    };
  }
}

function is_valid(board, cell, num) {
  if (num > 9 || num < 1) {
    return false;
  }
  let cellRowIndex = Math.floor(cell.i / 9);
  let cellColumnIndex = cell.i % 9;
  let [regionColumnIndex, regionRowIndex] = getRegionCoordinate(cell.i);
  let startColumnIndex = regionColumnIndex * 3;
  let startRowIndex = regionRowIndex * 3;
  let rowOffset = 0;
  let colOffset = 0;

  let option_scope = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let i = 0; i < 9; i++) {
    // check row cell i
    option_scope.delete(board[cellRowIndex * 9 + i].num);

    // check col cell i
    option_scope.delete(board[i * 9 + cellColumnIndex].num);

    // check region cell i
    rowOffset = Math.floor(i / 3); // 0, 0, 0, 9, 9, 9, 18, 18, 18
    colOffset = i % 3; // 0, 1, 2, 0, 1, 2, ...

    let finalColIndex = startColumnIndex + colOffset;
    let finalRowIndex = startRowIndex + rowOffset;
    let final_index = getIndex([finalColIndex, finalRowIndex]);

    option_scope.delete(board[final_index].num);
  }
  return option_scope.has(num);
}

/**
 * Returns the region for a given index
 *
 * @param index The index of the sudoku board 1D array.
 * @returns [regionColumnIndex, regionRowIndex]
 */
function getRegionCoordinate(index) {
  let [cellColumnIndex, cellRowIndex] = getCellCoordinate(index);

  let regionColumnIndex = Math.floor(cellColumnIndex / 3);
  let regionRowIndex = Math.floor(cellRowIndex / 3);

  return [regionColumnIndex, regionRowIndex];
}

/**
 * Returns the cell coordinates for a given index
 *
 * @param index The index of the sudoku board 1D array.
 * @returns [cellColumnIndex, cellRowIndex]
 */
function getCellCoordinate(index) {
  let cellColumnIndex = index % 9;
  let cellRowIndex = Math.floor(index / 9);

  return [cellColumnIndex, cellRowIndex];
}

/**
 * Returns the index for a given coordinate.
 *
 * @param coordinate The coordinate of a cell in a standard sudoku board.
 * @returns index
 */
function getIndex(coordinate) {
  let [cellColumnIndex, cellRowIndex] = coordinate;

  return cellRowIndex * 9 + cellColumnIndex;
}
