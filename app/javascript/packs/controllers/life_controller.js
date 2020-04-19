import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "boardSize", "board" ]

  generate() {
    console.log(this.board)
    this.board.innerHTML = '';

    for (let i = 0; i < this.boardSize; i++) {
      var tr = this.board.insertRow(i);

      for (let j = 0; j < this.boardSize; j++) {
        var td = tr.insertCell(j);
        td.classList.add("dead");
        td.setAttribute("data-action", "click->life#toggleLife")
      }
    }
  }

  initGeneration() {
    var liveCells = [];

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        var cell = [i, j]

        if (this.willBeAlive(cell)) {
          liveCells.push(cell);
        }
      }
    }

    this.clearBoard()

    this.makeCellsAlive(liveCells)
  }

  toggleLife(event) {
    this.toggleClass(event.target);
  }

  toggleClass(element) {
    element.classList.toggle("dead");
    element.classList.toggle("live");
  }

  willBeAlive(cell) {
    var row = cell[0];
    var col = cell[1];
    var currentCellIsAlive = this.isAlive(row, col);

    var numOfLiveCells = 0;

    if(row>0 && this.isAlive(row-1, col)) {
      numOfLiveCells++;
    }

    if(row>0 && col>0 && this.isAlive(row-1, col-1)) {
      numOfLiveCells++;
    }

    if(row>0 && col < (this.boardSize-1) && this.isAlive(row-1, col+1)) {
      numOfLiveCells++;
    }

    if(col>0 && this.isAlive(row, col-1)) {
      numOfLiveCells++;
    }

    if(col < (this.boardSize-1) && this.isAlive(row, col+1)) {
      numOfLiveCells++;
    }

    if(row < (this.boardSize-1) && this.isAlive(row+1, col)) {
      numOfLiveCells++;
    }

    if(row < (this.boardSize-1) && col>0 && this.isAlive(row+1, col-1)) {
      numOfLiveCells++;
    }

    if(row < (this.boardSize-1) && col<(this.boardSize-1) && this.isAlive(row+1, col+1)) {
      numOfLiveCells++;
    }

    if(currentCellIsAlive && (numOfLiveCells < 2 || numOfLiveCells > 3)) {
      return false;
    } else if(!currentCellIsAlive && numOfLiveCells == 3) {
      return true;
    } else {
      return currentCellIsAlive;
    }
  }

  clearBoard() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        this.board.rows[i].cells[j].classList.remove("live");
        this.board.rows[i].cells[j].classList.add("dead");
      }
    }
  }

  makeCellsAlive(liveCells) {
    liveCells.forEach(element => {
      this.toggleClass(this.board.rows[element[0]].cells[element[1]]);
    });
  }

  isAlive(row, col) {
    return this.board.rows[row].cells[col].classList.contains('live');
  }

  get boardSize() {
    return this.boardSizeTarget.value
  }

  get board() {
    return this.boardTarget
  }
}