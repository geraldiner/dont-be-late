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

    for (let i = 0; i < this._shuffledAvailableTiles.length; i++) {
      new TaskTile(
        this,
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 -
          pageBackground.height / 2 +
          titleText.height +
          agendaHeadingBackground.height +
          SIZING.PADDING * 2 +
          i * 40,
        this._shuffledAvailableTiles[i].label,
      );
      if (i === this._shuffledAvailableTiles.length - 1) {
        this.lastTilePosition.x = this.game.canvas.width / 2;
        this.lastTilePosition.y =
          this.game.canvas.height / 2 -
          pageBackground.height / 2 +
          titleText.height +
          agendaHeadingBackground.height +
          SIZING.PADDING * 2 +
          i * 40;
      }
    }

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

    this.add.text(
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
    // this.createLayout(gm);
    // this.createTileBar(gm);
    // this.createDragEvents(gm);
  }

  private createDragEventStartEventListener(): void {
    this.input.on(
      Phaser.Input.Events.DRAG_START,
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        gameObject.setDepth(2);
      },
    );
  }

  private createDragEventListener(): void {
    this.input.on(
      Phaser.Input.Events.DRAG,
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Image,
        dragX: number,
        dragY: number,
      ) => {
        gameObject.setPosition(dragX, dragY);
        gameObject.setDepth(2);
      },
    );
  }

  private createDragEndEventListener(): void {
    this.input.on(
      Phaser.Input.Events.DRAG_END,
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        const originalX = gameObject.getData("x") as number;
        const originalY = gameObject.getData("y") as number;
        gameObject.setPosition(originalX, originalY);
      },
    );
  }

  private createDropEventListener(gm: GameManager): void {
    this.input.on(
      Phaser.Input.Events.DROP,
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Image,
        dropZone: Phaser.GameObjects.Zone,
      ) => {
        if (dropZone) {
          this.handleTileDropOnZone(gm, gameObject, dropZone);
          if (gameObject.getData("from") !== "tileBar") {
            gameObject.destroy();
          }
        }
      },
    );
  }

  private handleTileDropOnZone(
    gm: GameManager,
    tile: Phaser.GameObjects.Image,
    dropZone: Phaser.GameObjects.Zone,
  ): void {
    const isTileBar = dropZone.getData("isTileBar") as boolean | undefined;
    // If tile is dropped into tile bar, remove from panel slots and from placed tiles
    if (isTileBar) {
      const currentSlotIndex = tile.getData("currentSlotIndex") as
        | number
        | null;
      if (currentSlotIndex !== null && currentSlotIndex !== undefined) {
        // Remove tile from placed tiles
        gm.updatePlacedTiles(undefined, undefined, currentSlotIndex);
        tile.destroy();
        // TODO: Enable the previously disabled tile in the tile bar
      }
    } else {
      // Otherwise, tile is dropped into a panel slot
      const tileData = tile.getData("tileData") as {
        key: string;
        label: string;
        duration: number;
      };
      const slotIndex = dropZone.getData("slotIndex") as number;
      const slotTexture = dropZone.getData(
        "slotTexture",
      ) as Phaser.GameObjects.Image;
      const slotContainer = dropZone.getData(
        "slotContainer",
      ) as Phaser.GameObjects.Container;
      const newTile = this.createTile(
        slotTexture.x + slotTexture.width / 2,
        slotTexture.y + slotTexture.height / 2,
        tileData.key,
      ).setData({
        currentSlotIndex: slotIndex,
        tileData: tile.getData("tileData"),
      });

      // If tile place is already occupied, remove the previous tile
      const occupiedBy = dropZone.getData(
        "occupiedBy",
      ) as Phaser.GameObjects.Image | null;
      const currentSlotIndex = tile.getData("currentSlotIndex") as
        | number
        | null;

      // Update placed tiles to add new tile to the specified index in the list
      // and remove it from the previous index if applicable
      gm.updatePlacedTiles(slotIndex, tileData.key, currentSlotIndex);

      // Remove the previous tile
      if (occupiedBy) {
        occupiedBy.destroy();
      }
      dropZone.setData("occupiedBy", newTile);
      slotContainer.add(newTile);
      // tile.setPosition(tile.getData("x"), tile.getData("y"));
      // tile.setInteractive({ useHandCursor: false });
      // tile.disableInteractive();
    }
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
