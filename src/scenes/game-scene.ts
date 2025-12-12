import * as Phaser from "phaser";

import { PreludeScreen } from "../game-screens/prelude";
import { GameManager } from "../manager/game-manager";
import { LetsGoButton } from "../ui/buttons";
import type { Button } from "../ui/buttons/button";
import { FONT_KEYS, SCENE_KEYS, SIZING } from "../variables";

const DEBUG: boolean = true;

const TILE_BAR_Y_POSITION: number = 480;
const TILE_BAR_HEIGHT: number = 120;

export class GameScene extends Phaser.Scene {
  private panelContainers: Phaser.GameObjects.Container[] = [];
  private _letsGoButton: Button | null = null;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  public create(): void {
    const gm = GameManager.getInstance();
    // DEBUG: Comment out to skip prelude screen
    new PreludeScreen(this, 0, 0);
    gm.setupLevel();
    this.createLayout(gm);
    this.createTileBar(gm);
    this.createDragEvents(gm);
  }

  private createTile(
    x: number,
    y: number,
    imageKey: string,
    frameNumber: number = 0,
    scale: number = 1,
    draggable: boolean = true,
  ): Phaser.GameObjects.Image {
    return this.add
      .image(x, y, imageKey, frameNumber)
      .setOrigin(0.5)
      .setScale(scale)
      .setInteractive({ useHandCursor: true, draggable: draggable })
      .setData({
        x,
        y,
        imageKey,
      });
  }

  private createLayout(gm: GameManager): void {
    this.panelContainers = [];
    for (let i = 1; i <= gm.panelAmount; i++) {
      const panelContainer = this.add.container(
        this.game.canvas.width / 2 -
          (SIZING.PANEL_WIDTH * gm.panelAmount) / 2 +
          SIZING.PANEL_WIDTH * (i - 1),
        SIZING.PADDING * 2.5,
        [],
      );
      const panelObject = this.add
        .rectangle(0, 0, SIZING.PANEL_WIDTH, SIZING.PANEL_HEIGHT, 0xffffff)
        .setOrigin(0)
        .setStrokeStyle(2, 0x000000);
      panelContainer.add(panelObject);

      if (i === gm.panelAmount) {
        this.createTilePlaces(panelContainer, gm.tileLayout);
        const titleObject = this.add
          .text(SIZING.PADDING * 2, SIZING.PADDING, gm.getTitle(), {
            fontFamily: FONT_KEYS.REGULAR,
            fontSize: "14px",
            color: "#000000",
          })
          .setOrigin(0);
        panelContainer.add(titleObject);
        const letsGoButton = new LetsGoButton(
          this,
          panelObject.width - SIZING.BUTTON_WIDTH / 2 - SIZING.PADDING * 2,
          panelObject.height - SIZING.BUTTON_HEIGHT / 2 - SIZING.PADDING * 2,
        );
        this._letsGoButton = letsGoButton;
        panelContainer.add(letsGoButton);
      }
      this.panelContainers.push(panelContainer);
    }
  }

  private createTilePlaces(
    panelContainer: Phaser.GameObjects.Container,
    tileLayout: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>,
  ): void {
    const tileContainer = this.add.container(
      SIZING.PADDING * 2,
      SIZING.PADDING * 3,
      [],
    );

    panelContainer.add(tileContainer);

    tileLayout.forEach((tile) => {
      const tilePlace = this.add
        .rectangle(tile.x, tile.y, tile.width, tile.height, 0xf0f0f0)
        .setOrigin(0)
        .setStrokeStyle(1, 0x000000);
      tileContainer.add(tilePlace);
      const tileZone = this.add
        .zone(tile.x, tile.y, tile.width, tile.height)
        .setRectangleDropZone(tile.width, tile.height)
        .setOrigin(0)
        .setData({
          tilePlace,
          tileContainer,
          occupiedBy: null,
        });
      if (DEBUG) {
        const debugZone = this.add
          .rectangle(
            tileZone.x,
            tileZone.y,
            tileZone.width,
            tileZone.height,
            0x00ff00,
            0.3,
          )
          .setOrigin(0);
        tileContainer.add(debugZone);
      }
      tileContainer.add(tileZone);
    });
  }

  private createTileBar(gm: GameManager): void {
    const tileBarContainer = this.add.container(0, TILE_BAR_Y_POSITION, []);
    const tileBarBackground = this.add
      .rectangle(0, 0, this.game.canvas.width, TILE_BAR_HEIGHT)
      .setOrigin(0)
      .setStrokeStyle(2, 0x000000);
    tileBarContainer.add(tileBarBackground);
    const tileBarZone = this.add
      .zone(0, 0, this.game.canvas.width, TILE_BAR_HEIGHT)
      .setOrigin(0)
      .setRectangleDropZone(this.game.canvas.width, TILE_BAR_HEIGHT);
    tileBarContainer.add(tileBarZone);
    if (DEBUG) {
      const tileBarDebugBg = this.add
        .rectangle(
          tileBarZone.x,
          tileBarZone.y,
          tileBarZone.width,
          tileBarZone.height,
          0x00ff00,
          0.3,
        )
        .setOrigin(0);
      tileBarContainer.add(tileBarDebugBg);
    }

    const tilesListContainer = this.add.container(
      tileBarBackground.width / 2 -
        (SIZING.TILE_SIZE * gm.availableTiles.length) / 2,
      SIZING.TILE_SIZE / 2,
      [],
    );
    tileBarContainer.add(tilesListContainer);

    for (let i = 0; i < gm.availableTiles.length; i++) {
      const tileObj = this.createTile(
        i * (SIZING.TILE_SIZE + SIZING.PADDING * 2),
        SIZING.PADDING * 2,
        gm.availableTiles[i],
      )
        .setOrigin(0.5)
        .setData({ from: "tileBar" });
      if (DEBUG) {
        const tileDebugBg = this.add
          .rectangle(
            tileObj.x,
            tileObj.y,
            SIZING.TILE_SIZE,
            SIZING.TILE_SIZE,
            0x0000ff,
            0.3,
          )
          .setOrigin(0.5);
        tilesListContainer.add(tileDebugBg);
      }
      tilesListContainer.add(tileObj);
    }
  }

  private createDragEvents(gm: GameManager): void {
    this.createDragEventStartEventListener();
    this.createDragEventListener();
    this.createDragEndEventListener();
    this.createDropEventListener(gm);
  }

  private createDragEventStartEventListener(): void {
    this.input.on(
      Phaser.Input.Events.DRAG_START,
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        gameObject.setAlpha(0.7);
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
        gameObject.setAlpha(1);
        const originalX = gameObject.getData("x") as number;
        const originalY = gameObject.getData("y") as number;
        if (gameObject.getData("from") === "tileBar") {
          gameObject.setPosition(originalX, originalY);
        } else {
          gameObject.destroy();
        }
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
        const tilePlace = dropZone.getData("tilePlace") as
          | Phaser.GameObjects.Rectangle
          | undefined;
        if (tilePlace) {
          this.handleTileDropOnZone(gm, gameObject, dropZone);
        }
      },
    );
  }

  private handleTileDropOnZone(
    gm: GameManager,
    tile: Phaser.GameObjects.Image,
    dropZone: Phaser.GameObjects.Zone,
  ): void {
    const imageKey = tile.getData("imageKey") as string;
    const tilePlace = dropZone.getData(
      "tilePlace",
    ) as Phaser.GameObjects.Rectangle;
    const tileContainer = dropZone.getData(
      "tileContainer",
    ) as Phaser.GameObjects.Container;
    const tileObj = this.createTile(
      tilePlace.x + tilePlace.width / 2,
      tilePlace.y + tilePlace.height / 2,
      imageKey,
    ).setData({ from: "panel" });
    // If tile place is already occupied, remove the previous tile
    const occupiedBy = dropZone.getData(
      "occupiedBy",
    ) as Phaser.GameObjects.Image | null;
    if (occupiedBy) {
      occupiedBy.destroy();
    }
    dropZone.setData("occupiedBy", tileObj);
    tileContainer.add(tileObj);
  }
}
