import * as Phaser from "phaser";

import { ASSET_KEYS, SCENE_KEYS } from "../variables";

const DEBUG: boolean = true;
const DEFAULT_PADDING: number = 10;

const PANEL_SCALE: number = 1.15;
const PRELUDE_PANEL_Y_POSITION: number = 60;
const PANEL_WIDTH: number = 330;
const PANEL_HEIGHT: number = 420;

const TITLE_X_POSITION: number = 20;
const TITLE_Y_POSITION: number = 10;

const BUTTON_WIDTH: number = 90;
const BUTTON_HEIGHT: number = 25;

const TILE_BAR_Y_POSITION: number = 480;
const TILE_BAR_HEIGHT: number = 120;
const TILE_SIZE: number = 80;

const TILE_LAYOUT_MAP: {
  [key: number]: { x: number; y: number; width: number; height: number }[];
} = {
  5: [
    { x: 0, y: 0, width: 170, height: 98 },
    { x: 180, y: 0, width: 110, height: 98 },
    { x: 0, y: 108, width: 110, height: 98 },
    { x: 120, y: 108, width: 170, height: 98 },
    { x: 0, y: 216, width: 290, height: 118 },
  ],
};

const AVAILABLE_TILES = [
  ASSET_KEYS.ALARM,
  ASSET_KEYS.BACKPACK,
  ASSET_KEYS.SCROLL,
  ASSET_KEYS.TOOTHBRUSH,
  ASSET_KEYS.TRAIN,
];

const CHAPTER_TITLE = "1-1: Seito has an 8am class";

export class GameScene extends Phaser.Scene {
  private panelContainers: Phaser.GameObjects.Container[] = [];
  private availableTiles: Phaser.GameObjects.Image[] = [];
  private placedTiles: Phaser.GameObjects.Image[] = [];

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  public create(): void {
    this.createLayout(1);
    this.createTileBar();
    this.createDragEvents();
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

  private createLayout(panelAmount: number, isPrelude: boolean = false): void {
    this.panelContainers = [];
    for (let i = 1; i <= panelAmount; i++) {
      const panelContainer = this.add.container(
        this.game.canvas.width / 2 -
          (PANEL_WIDTH * panelAmount) / 2 +
          PANEL_WIDTH * (i - 1),
        DEFAULT_PADDING * 2.5,
        [],
      );
      const panelObject = this.add
        .rectangle(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 0xffffff)
        .setOrigin(0)
        .setScale(isPrelude ? PANEL_SCALE : 1)
        .setStrokeStyle(2, 0x000000);
      panelContainer.add(panelObject);
      // // just to check the scale/fit of the image
      // if (i == 1) {
      //   const preludeImage = this.add
      //     .image(
      //       PANEL_WIDTH / 2,
      //       PANEL_HEIGHT / 2,
      //       ASSET_KEYS.CHAPTER_1_PRELUDE,
      //     )
      //     .setOrigin(0.5)
      //     .setScale(0.499);
      //   panelContainer.add(preludeImage);
      // }

      if (i === panelAmount && !isPrelude) {
        this.createTilePlaces(panelContainer, 5);
        const titleObject = this.add
          .text(TITLE_X_POSITION, TITLE_Y_POSITION, CHAPTER_TITLE, {
            fontSize: "14px",
            color: "#000000",
          })
          .setOrigin(0);
        panelContainer.add(titleObject);
        const nextButtonContainer = this.add.container(
          panelObject.width - BUTTON_WIDTH - DEFAULT_PADDING * 2,
          panelObject.height - BUTTON_HEIGHT - DEFAULT_PADDING * 2,
          [],
        );
        const nextButton = this.add
          .rectangle(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 0xaaaaaa)
          .setOrigin(0)
          .setRounded(2)
          .setInteractive({ useHandCursor: true });
        const nextButtonText = this.add
          .text(BUTTON_WIDTH / 2, BUTTON_HEIGHT / 2, "Next", {
            fontSize: "12px",
            color: "#000000",
          })
          .setOrigin(0.5);
        nextButtonContainer.add(nextButton);
        nextButtonContainer.add(nextButtonText);
        panelContainer.add(nextButtonContainer);
      }
      this.panelContainers.push(panelContainer);
    }
  }

  private createTilePlaces(
    panelContainer: Phaser.GameObjects.Container,
    tileAmount: number,
  ): void {
    this.placedTiles = [];

    const tileContainer = this.add.container(
      DEFAULT_PADDING * 2,
      DEFAULT_PADDING * 3,
      [],
    );

    panelContainer.add(tileContainer);

    const layoutMap = TILE_LAYOUT_MAP[tileAmount];

    layoutMap.forEach((tile) => {
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

  private createTileBar(): void {
    this.availableTiles = [];
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
      tileBarBackground.width / 2 - (TILE_SIZE * AVAILABLE_TILES.length) / 2,
      TILE_SIZE / 2,
      [],
    );
    tileBarContainer.add(tilesListContainer);

    for (let i = 0; i < AVAILABLE_TILES.length; i++) {
      const tileObj = this.createTile(
        i * (TILE_SIZE + DEFAULT_PADDING * 2),
        DEFAULT_PADDING * 2,
        AVAILABLE_TILES[i],
      )
        .setOrigin(0.5)
        .setData({ from: "tileBar" });
      if (DEBUG) {
        const tileDebugBg = this.add
          .rectangle(tileObj.x, tileObj.y, TILE_SIZE, TILE_SIZE, 0x0000ff, 0.3)
          .setOrigin(0.5);
        tilesListContainer.add(tileDebugBg);
      }
      this.availableTiles.push(tileObj);
      tilesListContainer.add(tileObj);
    }
  }

  private createDragEvents(): void {
    this.createDragEventStartEventListener();
    this.createDragEventListener();
    this.createDragEndEventListener();
    this.createDropEventListener();
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

  private createDropEventListener(): void {
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
          this.handleTileDropOnZone(gameObject, dropZone);
        }
      },
    );
  }

  private handleTileDropOnZone(
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
    this.placedTiles.push(tileObj);
    tileContainer.add(tileObj);
  }
}
