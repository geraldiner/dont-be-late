import * as Phaser from "phaser";

import { PreludeScreen } from "../game-screens/prelude";
import { GameManager } from "../manager/game-manager";
import { LetsGoButton } from "../ui/buttons";
import { formatTime } from "../utils/date";
import { FONT_KEYS, SCENE_KEYS, SIZING } from "../variables";

const DEBUG: boolean = true;

const TILE_BAR_Y_POSITION: number = 480;
const TILE_BAR_HEIGHT: number = 120;

export class GameScene extends Phaser.Scene {
  private panelContainers: Phaser.GameObjects.Container[] = [];
  private currentTimeText: Phaser.GameObjects.Text = null!;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  public create(): void {
    const gm = GameManager.getInstance();
    // DEBUG: Comment out to skip prelude screen
    // new PreludeScreen(this, 0, 0);
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
        this.createPanelSlots(panelContainer, gm.panelLayout);
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
        panelContainer.add(letsGoButton);

        const currentTimeText = this.add
          .text(
            SIZING.PADDING * 2,
            panelObject.height - SIZING.BUTTON_HEIGHT - SIZING.PADDING * 2,
            `${formatTime(gm.currentTime)}`,
            {
              fontFamily: FONT_KEYS.REGULAR,
              fontSize: "14px",
              color: "#000000",
            },
          )
          .setOrigin(0);
        const targetTimeText = this.add
          .text(
            currentTimeText.width + SIZING.PADDING * 2,
            currentTimeText.y,
            ` / ${formatTime(gm.targetTime)}`,
            {
              fontFamily: FONT_KEYS.REGULAR,
              fontSize: "14px",
              color: "#000000",
            },
          )
          .setOrigin(0);
        panelContainer.add(targetTimeText);
        this.currentTimeText = currentTimeText;
        panelContainer.add(currentTimeText);
      }
      this.panelContainers.push(panelContainer);
    }
  }

  private createPanelSlots(
    panelContainer: Phaser.GameObjects.Container,
    panelLayout: Array<{
      x: number;
      y: number;
      texture: string;
    }>,
  ): void {
    const slotContainer = this.add.container(
      SIZING.PADDING * 2,
      SIZING.PADDING * 3,
      [],
    );

    panelLayout.forEach((slot, index) => {
      const slotTexture = this.add
        .image(slot.x, slot.y, slot.texture)
        .setOrigin(0);
      slotContainer.add(slotTexture);
      // TODO: If there are fixed position tiles, need to render those and ensure they're not overwritten
      const slotZone = this.add
        .zone(slot.x, slot.y, slotTexture.width, slotTexture.height)
        .setRectangleDropZone(slotTexture.width, slotTexture.height)
        .setOrigin(0)
        .setData({
          slotIndex: index,
          slotTexture,
          slotContainer,
          occupiedBy: null,
        });
      if (DEBUG) {
        const debugZone = this.add
          .rectangle(
            slotZone.x,
            slotZone.y,
            slotZone.width,
            slotZone.height,
            0x00ff00,
            0.3,
          )
          .setOrigin(0);
        slotContainer.add(debugZone);
      }
      slotContainer.add(slotZone);
    });
    panelContainer.add(slotContainer);
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
      .setRectangleDropZone(this.game.canvas.width, TILE_BAR_HEIGHT)
      .setData({ isTileBar: true });
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
        gm.availableTiles[i].key,
      )
        .setOrigin(0.5)
        .setData({ from: "tileBar", tileData: gm.availableTiles[i] });
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
        const slotTexture = dropZone.getData("slotTexture") as
          | Phaser.GameObjects.Image
          | undefined;
        if (slotTexture) {
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
    const isTileBar = dropZone.getData("isTileBar") as boolean | undefined;
    // If tile is dropped into tile bar, remove from panel slots and from placed tiles
    if (isTileBar) {
      const currentSlotIndex = tile.getData("currentSlotIndex") as
        | number
        | null;
      if (currentSlotIndex !== null) {
        // Remove tile from placed tiles
        gm.updatePlacedTiles(undefined, undefined, currentSlotIndex);
        tile.destroy();
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
      this.currentTimeText.setText(formatTime(gm.currentTime));
      if (gm.currentTime.getTime() > gm.targetTime.getTime()) {
        this.currentTimeText.setColor("#b31515ff");
      } else {
        this.currentTimeText.setColor("#2cb335ff");
      }
    }
  }
}
