import * as Phaser from "phaser";

import { GameManager, type Tile } from "../manager/game_manager";
import { GamePage } from "../ui/pages/game_page";
import { TaskTile } from "../ui/task_tile";
import { shuffleArray } from "../utils";
import { ASSET_KEYS, COLORS, SCENE_KEYS, SIZES } from "../variables";

export class GameScene extends Phaser.Scene {
  private _fixedTiles: Array<Tile> = [];
  private _occupiedIndices: Set<number> = new Set();
  private _freeTiles: Array<Tile> = [];
  private _tileViews: Array<TaskTile> = [];
  private _startY: number = 0;
  private _page: GamePage = null!;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  public create(): void {
    this.cameras.main.fadeIn(300, 207, 172, 140);
    const gm = GameManager.getInstance();
    gm.setupLevel();
    this._fixedTiles = gm.getFixedTiles();
    this._freeTiles = shuffleArray(gm.getFreeTiles());

    const breadcrumbs = ["Don't Be Late!", gm.chapterTitle, gm.levelTitle];

    const page = new GamePage(
      this,
      0,
      0,
      breadcrumbs,
      ASSET_KEYS.ACCENT_SCHOOL,
      COLORS.YELLOW.number,
    );
    this._page = page;

    // Create moveable tiles
    this._startY = page.startY;
    const occupied = new Set<number>();

    this._fixedTiles.forEach((tile) => {
      if (tile.fixedPositionIndex !== undefined) {
        new TaskTile(
          this,
          page.columnOneX + SIZES.COLUMN_ONE_WIDTH / 2,
          this._startY + tile.fixedPositionIndex * SIZES.TILE_HEIGHT,
          tile.label,
          tile.key,
          true,
        );
        occupied.add(tile.fixedPositionIndex);
      }
    });
    this._occupiedIndices = occupied;
    this._freeTiles.forEach((tile, index) => {
      if (!occupied.has(index)) {
        const taskTile = new TaskTile(
          this,
          page.columnOneX + SIZES.COLUMN_ONE_WIDTH / 2,
          this._startY + index * SIZES.TILE_HEIGHT,
          tile.label,
          tile.key,
          false,
        );
        this._tileViews[index] = taskTile;
        taskTile.on("tile-drag-start", this.onTileDragStart, this);
        taskTile.on("tile-drag-move", this.onTileDragMove, this);
        taskTile.on("tile-drag-end", this.onTileDragEnd, this);
      }
    });

    this.tweens.add({
      targets: [this],
      alpha: { from: 0, to: 1 },
      duration: 1500,
      ease: "EaseInOut",
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this._tileViews = [];
    });
  }

  private _getIndexFromY(y: number): number {
    return Phaser.Math.Clamp(
      Math.floor((y - this._startY) / 40 + 0.5),
      0,
      this._tileViews.length - 1,
    );
  }

  private _getYFromIndex(index: number): number {
    return this._startY + index * 40;
  }

  private _repositionTiles(exclude?: TaskTile) {
    this._tileViews.forEach((tile) => {
      if (tile !== exclude) {
        tile.snapTo(this._startY + this._tileViews.indexOf(tile) * 40);
      }
    });
  }

  private onTileDragStart(tile: TaskTile): void {}

  private onTileDragMove(tile: TaskTile): void {
    const oldIndex = this._tileViews.indexOf(tile);
    const newIndex = this._getIndexFromY(tile.y);

    if (newIndex !== oldIndex && !this._occupiedIndices.has(newIndex)) {
      this._tileViews.splice(oldIndex, 1);
      this._tileViews.splice(newIndex, 0, tile);
      this._repositionTiles(tile);
    }
  }

  private onTileDragEnd(tile: TaskTile): void {
    const gm = GameManager.getInstance();
    this._repositionTiles();
    const newSequence: Array<string> = [];
    this._fixedTiles.forEach((tile) => {
      newSequence[tile.fixedPositionIndex!] = tile.key;
    });

    this._tileViews.forEach((tile, index) => {
      if (!this._occupiedIndices.has(index)) {
        newSequence[index] = tile.key;
      }
    });

    gm.updateSequence(newSequence);
    this._page.updateCurrentTimeText();
  }
}
