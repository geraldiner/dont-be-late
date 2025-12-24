import * as Phaser from "phaser";

import { GameManager, type Tile } from "../manager/game_manager";
import { LetsGoButton } from "../ui/buttons";
import { TaskTile } from "../ui/task_tile";
import { formatTime, shuffleArray } from "../utils";
import { FONT_KEYS, PADDING, SCENE_KEYS, TEXTURE_KEYS } from "../variables";

export class GameScene extends Phaser.Scene {
  private _fixedTiles: Array<Tile> = [];
  private _freeTiles: Array<Tile> = [];
  private _tileViews: Array<TaskTile> = [];
  private startY: number = 0;
  private currentTimeText: Phaser.GameObjects.Text = null!;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  public create(): void {
    const gm = GameManager.getInstance();
    gm.setupLevel();
    this._fixedTiles = gm.getFixedTiles();
    this._freeTiles = shuffleArray(gm.getFreeTiles());

    // Create page layout
    const pageBackground = this.add
      .rectangle(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        420,
        560,
        0xffffff,
      )
      .setRounded(6)
      .setStrokeStyle(2, 0x000000)
      .setOrigin(0.5);
    const titleText = this.add.text(
      pageBackground.x - pageBackground.width / 2 + PADDING.TWENTY,
      pageBackground.y - pageBackground.height / 2 + PADDING.TEN,
      gm.getTitle(),
      {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: "16px",
        color: "#111111",
      },
    );
    const agendaHeadingBackground = this.add
      .image(
        titleText.x,
        titleText.y + titleText.height + PADDING.TEN,
        TEXTURE_KEYS.AGENDA_HEADING_ROUNDED_RECTANGLE,
      )
      .setOrigin(0);
    this.add
      .text(
        agendaHeadingBackground.x + PADDING.TWENTY,
        agendaHeadingBackground.height / 2 + agendaHeadingBackground.y,
        "TODAY'S AGENDA",
        {
          fontFamily: FONT_KEYS.SERIF,
          fontSize: "14px",
          color: "#111111",
        },
      )
      .setOrigin(0, 0.5);

    // Create moveable tiles
    const startY =
      this.game.canvas.height / 2 -
      pageBackground.height / 2 +
      titleText.height +
      agendaHeadingBackground.height +
      PADDING.TWENTY;
    this.startY = startY;
    const occupied = new Set<number>();

    this._fixedTiles.forEach((tile) => {
      if (tile.fixedPositionIndex !== undefined) {
        new TaskTile(
          this,
          this.game.canvas.width / 2,
          this.startY + tile.fixedPositionIndex * 40,
          tile.label,
          tile.key,
          true,
        );
        occupied.add(tile.fixedPositionIndex);
      }
    });

    this._freeTiles.forEach((tile, index) => {
      if (!occupied.has(this._tileViews.length)) {
        const taskTile = new TaskTile(
          this,
          this.game.canvas.width / 2,
          this.startY + index * 40,
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

    const lastTilePositionX = this.game.canvas.width / 2;
    const lastTilePositionY = gm.availableTiles.length * 40 + this.startY;

    // Add agenda summary with current/target times
    const agendaSummaryBackground = this.add
      .image(
        lastTilePositionX,
        lastTilePositionY,
        TEXTURE_KEYS.AGENDA_SUMMARY_ROUNDED_RECTANGLE,
      )
      .setOrigin(0.5, 0);

    const currentTimeLabel = this.add.text(
      agendaSummaryBackground.x -
        agendaSummaryBackground.width / 2 +
        PADDING.TWENTY,
      agendaSummaryBackground.y + PADDING.TEN,
      "CURRENT TIME",
      {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: "14px",
        color: "#111111",
      },
    );

    this.currentTimeText = this.add.text(
      agendaSummaryBackground.x -
        agendaSummaryBackground.width / 2 +
        PADDING.TWENTY,
      currentTimeLabel.y + currentTimeLabel.height + PADDING.TEN,
      `${formatTime(gm.currentTime)}`,
      {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: "16px",
        color: "#111111",
      },
    );

    const targetTimeLabel = this.add.text(
      agendaSummaryBackground.x,
      agendaSummaryBackground.y + PADDING.TEN,
      "TARGET TIME",
      {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: "14px",
        color: "#111111",
      },
    );

    this.add.text(
      agendaSummaryBackground.x,
      targetTimeLabel.y + targetTimeLabel.height + PADDING.TEN,
      `${formatTime(gm.targetTime)}`,
      {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: "16px",
        color: "#111111",
      },
    );

    // Add Let's Go button
    new LetsGoButton(
      this,
      pageBackground.x,
      pageBackground.y + pageBackground.height / 2 - 40,
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this._tileViews = [];
    });
  }

  private _getIndexFromY(y: number): number {
    return Phaser.Math.Clamp(
      Math.floor((y - this.startY) / 40 + 0.5),
      0,
      this._tileViews.length - 1,
    );
  }

  private _getYFromIndex(index: number): number {
    return this.startY + index * 40;
  }

  private _repositionTiles(exclude?: TaskTile) {
    this._tileViews.forEach((tile) => {
      if (tile !== exclude) {
        tile.snapTo(this.startY + this._tileViews.indexOf(tile) * 40);
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
    const occupied = new Set<number>();
    const newSequence: Array<string> = [];
    this._fixedTiles.forEach((tile) => {
      newSequence[tile.fixedPositionIndex!] = tile.key;
      occupied.add(tile.fixedPositionIndex!);
    });

    this._tileViews.forEach((tile, index) => {
      if (!occupied.has(index)) {
        newSequence[index] = tile.key;
      }
    });

    gm.updateSequence(newSequence);
    this.updateTimeText();
  }

  private updateTimeText(): void {
    const gm = GameManager.getInstance();
    this.currentTimeText.setText(formatTime(gm.currentTime));
    if (gm.currentTime.getTime() > gm.targetTime.getTime()) {
      this.currentTimeText.setColor("#b31515ff");
    } else {
      this.currentTimeText.setColor("#2cb335ff");
    }
  }
}
