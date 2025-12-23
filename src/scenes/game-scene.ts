import * as Phaser from "phaser";

import { PreludeScreen } from "../game-screens/prelude";
import { GameManager } from "../manager/game-manager";
import { LetsGoButton } from "../ui/buttons";
import { TaskTile } from "../ui/task_tile";
import { formatTime, shuffleArray } from "../utils";
import { FONT_KEYS, SCENE_KEYS, SIZING, TEXTURE_KEYS } from "../variables";

export class GameScene extends Phaser.Scene {
  private _shuffledAvailableTiles: Array<{
    key: string;
    label: string;
    duration: number;
  }> = [];
  private _tileViews: Array<TaskTile> = [];
  private startY: number = 0;
  private lastTilePosition: { x: number; y: number } = { x: 0, y: 0 };
  private currentTimeText: Phaser.GameObjects.Text = null!;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  public create(): void {
    const gm = GameManager.getInstance();
    // DEBUG: Comment out to skip prelude screen
    // new PreludeScreen(this, 0, 0);
    gm.setupLevel();
    this._shuffledAvailableTiles = shuffleArray(gm.availableTiles);

    // Create page layout
    const pageBackground = this.add
      .rectangle(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        420,
        560,
        0xffffff,
      )
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x000000);
    const titleText = this.add.text(
      pageBackground.x - pageBackground.width / 2 + SIZING.PADDING * 2,
      pageBackground.y - pageBackground.height / 2 + SIZING.PADDING,
      gm.getTitle(),
      {
        fontFamily: FONT_KEYS.REGULAR,
        fontSize: "16px",
        color: "#111111",
      },
    );
    const agendaHeadingBackground = this.add
      .image(
        titleText.x,
        titleText.y + titleText.height + SIZING.PADDING,
        TEXTURE_KEYS.AGENDA_HEADING_ROUNDED_RECTANGLE,
      )
      .setOrigin(0);
    this.add
      .text(
        agendaHeadingBackground.x + SIZING.PADDING * 2,
        agendaHeadingBackground.height / 2 + agendaHeadingBackground.y,
        "TODAY'S AGENDA",
        {
          fontFamily: FONT_KEYS.REGULAR,
          fontSize: "14px",
          color: "#111111",
        },
      )
      .setOrigin(0, 0.5);

    // Create moveable tiles
    for (let i = 0; i < this._shuffledAvailableTiles.length; i++) {
      if (i === 0) {
        this.startY =
          this.game.canvas.height / 2 -
          pageBackground.height / 2 +
          titleText.height +
          agendaHeadingBackground.height +
          SIZING.PADDING * 2;
      }
      const taskTile = new TaskTile(
        this,
        this.game.canvas.width / 2,
        this.startY + i * 40,
        this._shuffledAvailableTiles[i].label,
        this._shuffledAvailableTiles[i].key,
      );

      if (i === this._shuffledAvailableTiles.length - 1) {
        this.lastTilePosition.x = this.game.canvas.width / 2;
        this.lastTilePosition.y = this.startY + i * 40;
      }
      this._tileViews.push(taskTile);
      taskTile.on("tile-drag-start", this.onTileDragStart, this);
      taskTile.on("tile-drag-move", this.onTileDragMove, this);
      taskTile.on("tile-drag-end", this.onTileDragEnd, this);

      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this._tileViews = [];
      });
    }

    // Add agenda summary with current/target times
    const agendaSummaryBackground = this.add
      .image(
        this.lastTilePosition.x,
        this.lastTilePosition.y + 40,
        TEXTURE_KEYS.AGENDA_SUMMARY_ROUNDED_RECTANGLE,
      )
      .setOrigin(0.5, 0);

    const currentTimeLabel = this.add.text(
      agendaSummaryBackground.x -
        agendaSummaryBackground.width / 2 +
        SIZING.PADDING * 2,
      agendaSummaryBackground.y + SIZING.PADDING,
      "CURRENT TIME",
      {
        fontFamily: FONT_KEYS.REGULAR,
        fontSize: "14px",
        color: "#111111",
      },
    );

    this.currentTimeText = this.add.text(
      agendaSummaryBackground.x -
        agendaSummaryBackground.width / 2 +
        SIZING.PADDING * 2,
      currentTimeLabel.y + currentTimeLabel.height + SIZING.PADDING,
      `${formatTime(gm.currentTime)}`,
      {
        fontFamily: FONT_KEYS.REGULAR,
        fontSize: "16px",
        color: "#111111",
      },
    );

    const targetTimeLabel = this.add.text(
      agendaSummaryBackground.x,
      agendaSummaryBackground.y + SIZING.PADDING,
      "TARGET TIME",
      {
        fontFamily: FONT_KEYS.REGULAR,
        fontSize: "14px",
        color: "#111111",
      },
    );

    this.add.text(
      agendaSummaryBackground.x,
      targetTimeLabel.y + targetTimeLabel.height + SIZING.PADDING,
      `${formatTime(gm.targetTime)}`,
      {
        fontFamily: FONT_KEYS.REGULAR,
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
  }

  private _getIndexFromY(y: number): number {
    return Phaser.Math.Clamp(
      Math.floor((y - this.startY) / 40 + 0.5),
      0,
      this._tileViews.length - 1,
    );
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
    gm.updateSequence(
      this._tileViews.map((tile) => {
        return tile.key;
      }),
    );
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
