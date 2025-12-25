import * as Phaser from "phaser";

import { DataManager } from "../manager/data_manager";
import { GameManager, type Tile } from "../manager/game_manager";
import { GamePage } from "../ui/pages/game_page";
import { TaskTile } from "../ui/task_tile";
import { shuffleArray } from "../utils";
import { SCENE_KEYS, SIZES } from "../variables";
import type { CHAPTERS } from "../variables/themes";

export class GameScene extends Phaser.Scene {
  private _fixedTiles: Array<Tile> = [];
  private _fixedTileIndices: Set<number> = new Set<number>();
  private _freeTiles: Array<Tile> = [];
  private _tileViews: Array<TaskTile> = [];
  private _startY: number = 0;
  private _page: GamePage = null!;
  private _isFirstMove: boolean = true;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  public create(): void {
    this.cameras.main.fadeIn(300, 207, 172, 140);
    this.tweens.add({
      targets: [this.cameras.main],
      duration: 777,
      y: { from: 600, to: 0 },
      ease: "Sine.easeInOut",
    });
    const dm = DataManager.getInstance();
    const gm = GameManager.getInstance();

    const {
      headerImageKey,
      pageIconKey,
      accentImageKey,
      mainColor,
      accentColor,
    } = dm.getChapterTheme(
      gm.chapterId as (typeof CHAPTERS)[keyof typeof CHAPTERS],
    );

    this._fixedTiles = gm.getFixedTiles();
    this._freeTiles = shuffleArray(gm.getFreeTiles());

    const breadcrumbs = ["Don't Be Late!", gm.chapterTitle, gm.levelTitle];

    const page = new GamePage(
      this,
      0,
      0,
      breadcrumbs,
      accentImageKey,
      mainColor.number,
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
    this._fixedTileIndices = new Set(occupied);
    let nextFreeIndex: number = 0;
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
        occupied.add(index);
      } else {
        while (occupied.has(nextFreeIndex)) {
          nextFreeIndex += 1;
        }
        const taskTile = new TaskTile(
          this,
          page.columnOneX + SIZES.COLUMN_ONE_WIDTH / 2,
          this._startY + nextFreeIndex * SIZES.TILE_HEIGHT,
          tile.label,
          tile.key,
          false,
        );
        this._tileViews[nextFreeIndex] = taskTile;
        taskTile.on("tile-drag-start", this.onTileDragStart, this);
        taskTile.on("tile-drag-move", this.onTileDragMove, this);
        taskTile.on("tile-drag-end", this.onTileDragEnd, this);
        occupied.add(nextFreeIndex);
      }
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
    const occupied = new Set<number>(this._fixedTileIndices);
    // Reposition tiles
    this._tileViews.forEach((tile, index) => {
      if (tile && tile !== exclude) {
        if (occupied.has(index)) {
          let newIndex = 0;
          while (occupied.has(newIndex)) {
            newIndex += 1;
          }
          tile.snapTo(this._getYFromIndex(newIndex));
          occupied.add(newIndex);
        } else {
          tile.snapTo(this._getYFromIndex(index));
          occupied.add(index);
        }
      }
    });
  }

  private onTileDragStart(tile: TaskTile): void {}

  private onTileDragMove(tile: TaskTile): void {
    const oldIndex = this._tileViews.indexOf(tile);
    const newIndex = this._getIndexFromY(tile.y);

    if (newIndex !== oldIndex) {
      this._tileViews.splice(oldIndex, 1);
      this._tileViews.splice(newIndex, 0, tile);
      this._repositionTiles(tile);
    }
  }

  private onTileDragEnd(tile: TaskTile): void {
    const gm = GameManager.getInstance();
    this._repositionTiles();
    const occupied = new Set(this._fixedTileIndices);
    const newSequence: Array<string> = [];
    this._fixedTiles.forEach((tile) => {
      newSequence[tile.fixedPositionIndex!] = tile.key;
    });

    this._tileViews.forEach((tile, index) => {
      if (!occupied.has(index)) {
        newSequence[index] = tile.key;
        occupied.add(index);
      } else {
        let newIndex = 0;
        while (occupied.has(newIndex)) {
          newIndex += 1;
        }
        newSequence[newIndex] = tile.key;
        occupied.add(newIndex);
      }
    });

    gm.updateSequence(newSequence);
    this._page.updateCurrentTimeText();
    if (this._isFirstMove) {
      this._isFirstMove = false;
      this._page.letsGoButton.setIsDisabled(false);
    }
  }
}
