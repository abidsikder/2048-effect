/* Functions for manipulating grid in updates and game changes. */
import { GRID_SIZE, Position, Tile, Cell, Grid } from './model.ts';

const PROBABILITY_SPAWN_2 = 0.7;

class Game {
  public grid: Grid;

  constructor() {
    this.grid = new Grid();
  }

  // Spawns a new tile and returns the new Tile on success for spawning a tile, or a null if no tile was spawned
  public spawn(): Cell {
    const randomPosition = this.grid.randomAvailableCell();
    if (randomPosition === null) return null;

    const newTile = new Tile();
    newTile.nowPos = randomPosition;
    newTile.value = Math.random() < PROBABILITY_SPAWN_2 ? 2 : 4;

    this.grid.setCell(newTile.nowPos.x, newTile.nowPos.y, newTile);

    return newTile;
  }

  public isGameOver(): boolean {
    // if there are any empty cells then the game is not over since things can be moved around
    if (this.grid.hasAvailableCells()) return false;

    // check to see if there are any possible merges that can be made for each Tile
    let possibleMerges = false;
    Grid.forEachCell(this.grid, (x,y,c) => {
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
      for (let xp = x - 1; x >= 1; xp--) {
        const cp = this.grid.getCell(xp,y);
        if (cp === null) continue;
        if (cp.value === v) {
          possibleMerges = true;
          return;
        }
        else break;
      }

      // Rightwards
      for (let xp = x + 1; x <= GRID_SIZE; xp++) {
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

  public moveLeft() {
    // merge all tiles
    Grid.forEachRow(y => {
      for (let x = 2; x <= GRID_SIZE; x++) {
        // left neighbor
        const lnbr = this.grid.getCell(x-1,y);
        if (lnbr === null) continue;

        // cell we are actually inspecting
        const c = this.grid.getCell(x,y);
        if (c === null) continue;

        // if we can't merge
        if (c.value !== lnbr.value) continue;

        // Create new tile
        const newTile = new Tile();
        newTile.nowPos.x = x-1;
        newTile.nowPos.y = y;
        newTile.value = c.value * 2;
        newTile.setMergedFrom(lnbr, c);

        // Remove the two current tiles under consideration from the grid
        this.grid.emptyTheCell(x-1, y);
        this.grid.emptyTheCell(x, y);

        // Put new tile in the old left neighbors place
        this.grid.setCell(x-1, y, newTile);
      }
    });

    // move tiles without merging
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
          const t = cp;
          this.grid.emptyTheCell(xp,y);
          t.updatePos(new Position(x,y));
          this.grid.setCell(x,y,t);

          // we've already filled in so stop running this loop
          break;
        }
      }
    });
  }
  public moveRight() {
    // merge all tiles
    Grid.forEachRow(y => {
      for (let x = GRID_SIZE-1; x >= 1; x--) {
        // right neighbor
        const rnbr = this.grid.getCell(x+1,y);
        if (rnbr === null) continue;

        // cell we are actually inspecting
        const c = this.grid.getCell(x,y);
        if (c === null) continue;

        // if we can't merge
        if (c.value !== rnbr.value) continue;

        // Create new tile
        const newTile = new Tile();
        newTile.nowPos.x = x+1;
        newTile.nowPos.y = y;
        newTile.value = c.value * 2;
        newTile.setMergedFrom(rnbr, c);

        // Remove the two current tiles under consideration from the grid
        this.grid.emptyTheCell(x+1, y);
        this.grid.emptyTheCell(x,y);

        // Put new tile in the old right neighbors place
        this.grid.setCell(x+1,y,newTile);
      }
    });

    // move all tiles without merging
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
          const t = cp;
          this.grid.emptyTheCell(xp,y);
          t.updatePos(new Position(x,y));
          this.grid.setCell(x,y,t);

          // we've already filled in so stop running this loop
          break;
        }
      }
    });
  }

  // public moveDown() {

  // }
  // public moveUp() {

  // }

  public toString(): string {
    return this.grid.toString();
  }
}

export { Game };
