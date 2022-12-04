/* Functions for manipulating grid in updates and game changes. */
import { Position, Tile, Grid } from './model.ts';

const PROBABILITY_SPAWN_2 = 0.7;

class Game {
  public grid: Grid;

  constructor() {
    this.grid = new Grid();
  }

  // Returns the new Tile on success for spawning a tile, or a null if no tile was spawned
  public spawn(): Tile | null  {
    const randomPosition = this.grid.randomAvailableCell();
    if (randomPosition === null) return null;

    const newTile = new Tile();
    newTile.nowPos = randomPosition;
    newTile.value = Math.random() < PROBABILITY_SPAWN_2 ? 2 : 4;

    this.grid.setCell(newTile.nowPos.x, newTile.nowPos.y, newTile);

    return newTile;
  }

  // public moveLeft() {

  // }
  // public moveRight() {

  // }
  // public moveDown() {

  // }
  // public moveUp() {

  // }
}

export { Game };
