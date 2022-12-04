/* Grid Positioning
 * For a grid that looks like
 [ ] [ ] [ ] [ ]
 [ ] [ ] [ ] [ ]
 [ ] [ ] [ ] [ ]
 [ ] [ ] [ ] [ ]
 * We use integer coordinates, where for the bottom left cell m
 [ ] [ ] [ ] [ ]
 [ ] [ ] [ ] [ ]
 [ ] [ ] [ ] [ ]
 [m] [ ] [ ] [ ]
 * m has coordinates (x=1,y=1), and a cell a
 [ ] [ ] [ ] [a]
 [ ] [ ] [ ] [ ]
 [ ] [ ] [ ] [ ]
 [ ] [ ] [ ] [ ]
 * a has coordinates (x=4,y=4)
 */
const GRID_SIZE = 4; // number of squares on each side of the grid

// Return a random integer between 1 and range, inclusive
function randInt(range: number): number {
  return Math.floor(Math.random()*(range+1));
}

class Position {
  public x: number;
  public y: number;
  public constructor(x?: number,y?: number) {
    this.x = x === undefined ? randInt(GRID_SIZE) : x;
    this.y = y === undefined ? randInt(GRID_SIZE) : y;
  }
}

class Tile {
  public nowPos: Position;
  public prevPos: Position;
  public value: number;
  public mergedFrom: Tile[];

  // initialize to a random position
  public constructor() {
    this.nowPos = new Position();
    this.prevPos = new Position(0,0);
    this.value = 2;
    this.mergedFrom = [];
  }

  public updatePos(newPos:Position) {
    this.prevPos = this.nowPos;
    this.nowPos = newPos;
  }
}

type Cell = Tile | null;

class Grid {
  public cells: Cell[][];

  constructor() {
    this.cells = [[null,null,null,null],
              [null,null,null,null],
              [null,null,null,null],
              [null,null,null,null]];
  }

  /*
   * Think of the arrays are reaching backwards and up
   * cells =
      3],   3],  3],  3],
      2,    2,   2,   2,
      1,    1,   1,   1,
   [ [0   [0    [0   [0   ]
   */
  getCell(x:number,y:number): Cell {
    return this.cells[x-1][y-1];
  }
  setCell(x:number,y:number,c: Cell) {
    this.cells[x-1][y-1] = c;
  }

  public availablePositions(): Position[] {
    const available = [];
    for (let x = 1; x <= GRID_SIZE; x++) {
      for (let y = 1; y <= GRID_SIZE; y++) {
        if (this.getCell(x,y) === null)
          available.push(new Position(x,y));
      }
    }
    return available;
  }

  public hasAvailableCells(): boolean {
    const available = this.availablePositions();
    return available.length > 0;
  }

  public randomAvailableCell(): Position | null {
    const available = this.availablePositions();
    if (available.length === 0) return null;

    return available[randInt(available.length-1)];
  }
}

export { GRID_SIZE, Grid };
