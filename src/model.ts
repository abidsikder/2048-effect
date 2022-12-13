import * as THREE from 'three'

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

 /*
 [ 13] [14 ] [ 15] [16]
 [ 9] [ 10] [11 ] [12 ]
 [5 ] [ 6] [ 7] [ 8]
 [1] [ 2] [ 3] [4]
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
    // a prevPos at 0,0 indicates that it was just newly spawned
    this.prevPos = new Position(0,0);
    this.value = 2;
    this.mergedFrom = [];
  }

  public updatePos(newPos:Position) {
    this.prevPos = this.nowPos;
    this.nowPos = newPos;
  }

  public setMergedFrom(t1: Tile, t2: Tile): void {
    // this.mergedFrom = [].concat(t1, t2, t1.mergedFrom, t2.mergedFrom);
    this.mergedFrom.push(t1, t2);
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

  public toString(): string {
    let str = "";
    for (let y = GRID_SIZE; y >= 1; y--) {
      for (let x = 1; x <= GRID_SIZE; x++) {
        str += "[";
        const c = this.getCell(x,y);
        if (c === null) {
          str += "    ";
        }
        else {
          str += String(c.value).padStart(4," ");
        }
        str += "] "
      }
      str += "\n";
    }
    return str;
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
  setTile(x:number,y:number,t: Tile): void {
    t.nowPos.x = x;
    t.nowPos.y = y;
    this.cells[x-1][y-1] = t;
  }
  emptyTheCell(x:number,y:number): void {
    this.cells[x-1][y-1] = null;
  }

  public availablePositions(): Position[] {
    let available: Position[] = [];
    Grid.forEachCell(this, (x,y,c) => {
      if (c === null) available.push(new Position(x,y));
    });
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

  public static forEachRow(fn: (y:number) => any): void {
    for (let y = 1; y <= GRID_SIZE; y++) {
      fn(y);
    }
  }

  public static forEachColumn(fn: (x:number) => any): void {
    for (let x = 1; x <= GRID_SIZE; x++) {
      fn(x);
    }
  }

  public static forEachCell(g: Grid, fn: (x:number,y:number,c:Cell) => any): void {
    for (let x = 1; x <= GRID_SIZE; x++) {
      for (let y = 1; y <= GRID_SIZE; y++) {
        fn(x,y,g.getCell(x,y));
      }
    }
  }
}

export { GRID_SIZE, Position, Tile, Grid };
