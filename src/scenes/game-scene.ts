import * as Phaser from "phaser";

import { ASSET_KEYS, SCENE_KEYS } from "../variables";

const DEBUG: boolean = false;
const DEFAULT_PADDING: number = 10;

const PANEL_SCALE: number = 1.15;
const PRELUDE_PANEL_Y_POSITION: number = 60;
const PANEL_WIDTH: number = 330;
const PANEL_HEIGHT: number = 420;

const TITLE_X_POSITION: number = 20;
const TITLE_Y_POSITION: number = 10;

const BUTTON_WIDTH: number = 90;
const BUTTON_HEIGHT: number = 25;

const TILE_BAR_Y_POSITION: number = 460;
const TILE_BAR_HEIGHT: number = 140;
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
  ASSET_KEYS.ALARM,
  ASSET_KEYS.ALARM,
  ASSET_KEYS.ALARM,
  ASSET_KEYS.ALARM,
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
  }

  private createLayout(panelAmount: number, isPrelude: boolean = false): void {
    this.panelContainers = [];
    for (let i = 1; i <= panelAmount; i++) {
      const panelContainer = this.add.container(
        this.game.canvas.width / 2 -
          (PANEL_WIDTH * panelAmount) / 2 +
          PANEL_WIDTH * (i - 1),
        DEFAULT_PADDING,
        [],
      );
      const panelObject = this.add
        .rectangle(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 0xffffff)
        .setOrigin(0)
        .setScale(isPrelude ? PANEL_SCALE : 1)
        .setStrokeStyle(2, 0x000000);
      panelContainer.add(panelObject);
      this.createTilePlaces(panelContainer, 5);
      const titleObject = this.add
        .text(TITLE_X_POSITION, TITLE_Y_POSITION, CHAPTER_TITLE, {
          fontSize: "14px",
          color: "#000000",
        })
        .setOrigin(0);
      panelContainer.add(titleObject);
      if (i === panelAmount && !isPrelude) {
        console.log("Hello");
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

  private createTile(
    x: number,
    y: number,
    imageKey: string,
    frameNumber: number = 0,
    scale: number = 1,
  ): Phaser.GameObjects.Image {
    return this.add
      .image(x, y, imageKey, frameNumber)
      .setOrigin(0)
      .setScale(scale);
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
      const tileObj = this.createTile(
        tile.x + tile.width / 2 - TILE_SIZE / 2,
        tile.y + tile.height / 2 - TILE_SIZE / 2,
        ASSET_KEYS.ALARM,
      ).setVisible(false);
      this.placedTiles.push(tileObj);
      tileContainer.add(tileObj);
    });
  }

  private createTileBar(): void {
    this.availableTiles = [];
    const tileBarContainer = this.add.container(0, TILE_BAR_Y_POSITION, []);
    const tileBarBackground = this.add
      .rectangle(0, 0, this.game.canvas.width, TILE_BAR_HEIGHT, 0xdddddd)
      .setOrigin(0);
    tileBarContainer.add(tileBarBackground);

    const tilesListContainer = this.add.container(
      tileBarBackground.width / 2,
      tileBarBackground.height / 2 - TILE_SIZE / 2,
      [],
    );
    tileBarContainer.add(tilesListContainer);

    for (let i = 0; i < AVAILABLE_TILES.length; i++) {
      const tilePlace = this.add
        .rectangle(
          (TILE_SIZE + DEFAULT_PADDING * 2.5) * i -
            (AVAILABLE_TILES.length * (TILE_SIZE + DEFAULT_PADDING * 2.5)) / 2 +
            DEFAULT_PADDING / 2,
          0,
          TILE_SIZE,
          TILE_SIZE,
          0xffffff,
        )
        .setOrigin(0)
        .setRounded(4);
      tilesListContainer.add(tilePlace);
      const tileObj = this.createTile(
        tilePlace.x,
        tilePlace.y,
        AVAILABLE_TILES[i],
      );
      this.availableTiles.push(tileObj);
      tilesListContainer.add(tileObj);
    }
  }
}
