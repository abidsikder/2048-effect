/* Functions for manipulating grid in updates and game changes. */
import { GRID_SIZE, Position, Tile, Cell, Grid } from './model';

const PROBABILITY_SPAWN_2 = 0.7;

class Game {
  public grid: Grid;
  public score: number;
  public won: boolean;

  constructor() {
    this.grid = new Grid();
    this.score = 0;
    this.won = false;
  }

  // Spawns a new tile and returns the new Tile on success for spawning a tile, or a null if no tile was spawned
  public spawn(): Cell {
    const randomPosition = this.grid.randomAvailableCell();
    if (randomPosition === null) return null;

    const newTile = new Tile();
    newTile.nowPos = randomPosition;
    newTile.value = Math.random() < PROBABILITY_SPAWN_2 ? 2 : 4;

    this.grid.setTile(newTile.nowPos.x, newTile.nowPos.y, newTile);

    return newTile;
  }

  public isGameOver(): boolean {
    // if there are any empty cells then the game is not over since things can be moved around
    if (this.grid.hasAvailableCells()) return false;

    // check to see if there are any possible merges that can be made for each Tile
    let possibleMerges = false;
    Grid.forEachCell(this.grid, (x:number,y:number,c:Cell) => {
      if (c === null) return;

      // If we already found something no need to keep running this
      if (possibleMerges) return;

      const v = c.value;
      // Check in all directions for a possible merge
      // Upwards
      for (let yp = y + 1; yp <= GRID_SIZE; yp++) {
        const cp = this.grid.getCell(x,yp);
        if (cp === null) continue;
        if (cp.value === v) {
          possibleMerges = true;
          return;
        }
        else break;
      }

      // Downwards
      for (let yp = y - 1; yp >= 1; yp--) {
        const cp = this.grid.getCell(x,yp);
        if (cp === null) continue;
        if (cp.value === v) {
          possibleMerges = true;
          return;
        }
        else break;
      }

      // Leftwards
      for (let xp = x - 1; xp >= 1; xp--) {
        const cp = this.grid.getCell(xp,y);
        if (cp === null) continue;
        if (cp.value === v) {
          possibleMerges = true;
          return;
        }
        else break;
      }

      // Rightwards
      for (let xp = x + 1; xp <= GRID_SIZE; xp++) {
        const cp = this.grid.getCell(xp,y);
        if (cp === null) continue;
        if (cp.value === v) {
          possibleMerges = true;
          return;
        }
        else break;
      }
    });
    if (possibleMerges) return false;

    // otherwise the game is over since there are no moves left
    return true;
  }

  // Returns the new tile that was just generated
  private mergeTwoTiles(t1: Tile, t2: Tile): Tile {
    const newTile = new Tile();
    newTile.value = t1.value + t2.value;
    this.score += newTile.value;
    newTile.setMergedFrom(t1, t2);
    if (newTile.value === 2048) this.won = true;
    return newTile;
  }

  /* All movement functions return true if at least one tile was moved. */

  public moveLeft(): boolean {

    // merge all tiles
    Grid.forEachRow(y => {
      for (let x = 1; x <= GRID_SIZE; x++) {
        // cell we are actually inspecting
        const c = this.grid.getCell(x,y);
        if (c === null) continue;

        for (let xp = x + 1; xp <= GRID_SIZE; xp++) {
          const cp = this.grid.getCell(xp,y);
          if (cp === null) continue;

          // check if it's indeed mergeable
          if (c.value !== cp.value) break;

          // Create new tile
          const newTile = this.mergeTwoTiles(cp, c);
          newTile.nowPos.x = x;
          newTile.nowPos.y = y;

          // Remove the two current tiles under consideration from the grid
          this.grid.emptyTheCell(x,y);
          this.grid.emptyTheCell(xp,y);

          // Put new tile in the old neighbor's place
          this.grid.setTile(x,y,newTile);
        }
      }
    });

    // move tiles without merging
    let moved = false;
    Grid.forEachRow(y => {
      for (let x = 1; x <= GRID_SIZE-1; x++) {
        const c = this.grid.getCell(x,y);

        // if there is no empty space here so just move on
        if (c !== null) continue;

        // but if there is an empty space, then look for tiles to fill it up
        for (let xp = x + 1; xp <= GRID_SIZE; xp++) {
          const cp = this.grid.getCell(xp, y);
          // if it's empty keep looking
          if (cp === null) continue;

          // otherwise move the tile
          moved = true;
          const t = cp;
          this.grid.emptyTheCell(xp,y);
          t.updatePos(new Position(x,y));
          this.grid.setTile(x,y,t);

          // we've already filled in so stop running this loop
          break;
        }
      }
    });

    return moved;
  }

  public moveRight(): boolean {

    // merge all tiles
    Grid.forEachRow(y => {
      for (let x = GRID_SIZE; x >= 1; x--) {
        // cell we are actually inspecting
        const c = this.grid.getCell(x,y);
        if (c === null) continue;

        for (let xp = x - 1; xp >= 1; xp--) {
          const cp = this.grid.getCell(xp,y);
          if (cp === null) continue;

          // check if it's indeed mergeable
          if (c.value !== cp.value) break;

          // Create new tile
          const newTile = this.mergeTwoTiles(cp, c);
          newTile.nowPos.x = x;
          newTile.nowPos.y = y;

          // Remove the two current tiles under consideration from the grid
          this.grid.emptyTheCell(x,y);
          this.grid.emptyTheCell(xp,y);

          // Put new tile in the old neighbor's place
          this.grid.setTile(x,y,newTile);
        }
      }
    });

    // move all tiles without merging
    let moved = false;
    Grid.forEachRow(y => {
      for (let x = GRID_SIZE; x >= 2; x--) {
        const c = this.grid.getCell(x,y);

        // if there is no empty space here so just move on
        if (c !== null) continue;

        // but if there is an empty space, then look for tiles to fill it up
        for (let xp = x - 1; xp >= 1; xp--) {
          const cp = this.grid.getCell(xp, y);
          // if it's empty keep looking
          if (cp === null) continue;

          // otherwise move the tile
          moved = true;
          const t = cp;
          this.grid.emptyTheCell(xp,y);
          t.updatePos(new Position(x,y));
          this.grid.setTile(x,y,t);

          // we've already filled in so stop running this loop
          break;
        }
      }
    });

    return moved;
  }

  public moveDown(): boolean {

    // merge all tiles
    Grid.forEachColumn(x => {
      for (let y = 1; y <= GRID_SIZE; y++) {
        // cell we are actually inspecting
        const c = this.grid.getCell(x,y);
        if (c === null) continue;

        for (let yp = y+1; yp <= GRID_SIZE; yp++) {
          const cp = this.grid.getCell(x,yp);
          if (cp === null) continue;

          // Check if it's indeed mergeable
          if (c.value !== cp.value) break;

          // Create new tile
          const newTile = this.mergeTwoTiles(cp, c);
          newTile.nowPos.x = x;
          newTile.nowPos.y = y;

          // Remove the two current tiles under consideration from the grid
          this.grid.emptyTheCell(x,y);
          this.grid.emptyTheCell(x,yp);

          // Put new tile in the old neighbor's place
          this.grid.setTile(x,y,newTile);
        }
      }
    });

    // move all tiles without merging
    let moved = false;
    Grid.forEachColumn(x => {
      for (let y = 1; y <= GRID_SIZE-1; y++) {
        const c = this.grid.getCell(x,y);

        // if there is no empty space here just move on
        if (c !== null) continue;

        // but if there is an empty space, then look for tiles to fill it up
        for (let yp = y+1; yp <= GRID_SIZE; yp++) {
          const cp = this.grid.getCell(x,yp);
          // if it's empty keep looking
          if (cp === null) continue;

          // otherwise move the tile
          moved = true;
          const t = cp;
          this.grid.emptyTheCell(x,yp);
          t.updatePos(new Position(x,y));
          this.grid.setTile(x,y,t);

          // we've already filled in so stop running this loop
          break;
        }
      }
    });

    return moved;
  }

  public moveUp(): boolean {

    // merge all tiles
    Grid.forEachColumn(x => {
      for (let y = GRID_SIZE; y >= 1; y--) {
        // cell we are actually inspecting
        const c = this.grid.getCell(x,y);
        if (c === null) continue;

        // find a neighbor that could be merged
        for (let yp = y-1; yp >= 1; yp--) {
          const cp = this.grid.getCell(x,yp);
          if (cp === null) continue;

          // check if it's indeed mergeable
          if (c.value !== cp.value) break;

          // Create new tile
          const newTile = this.mergeTwoTiles(cp, c);
          newTile.nowPos.x = x;
          newTile.nowPos.y = y;

          // Remove the two current tiles under consideration from the grid
          this.grid.emptyTheCell(x,y);
          this.grid.emptyTheCell(x,yp);

          // Put new tile in the old neighbor's place
          this.grid.setTile(x,y,newTile);
        }
      }
    });

    // move all tiles without merging
    let moved = false;
    Grid.forEachColumn(x => {
      for (let y = GRID_SIZE; y >= 2; y--) {
        const c = this.grid.getCell(x,y);

        // if there is no empty space here just move on
        if (c !== null) continue;

        // but if there is an empty space, then look for tiles to fill it up
        for (let yp = y - 1; yp >= 1; yp--) {
          const cp = this.grid.getCell(x,yp);
          // if it's empty keep looking
          if (cp === null) continue;

          // otherwise move the tile
          moved = true;
          const t = cp;
          this.grid.emptyTheCell(x,yp);
          t.updatePos(new Position(x,y));
          this.grid.setTile(x,y,t);

          // we've already filled in so stop running this loop
          break;
        }
      }
    });

    return moved;
  }

  public toString(): string {
    return `Score: ${this.score}\n` + this.grid.toString();
  }
}

export { Game };
