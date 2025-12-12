import * as Phaser from "phaser";

import VigaFont from "../assets/fonts/Viga-Regular.ttf";
import alarm from "../assets/images/1-1/alarm.png";
import backpack from "../assets/images/1-1/backpack.png";
import chapter1Prelude from "../assets/images/1-1/prelude.jpg";
import scroll from "../assets/images/1-1/scroll.png";
import toothbrush from "../assets/images/1-1/toothbrush.png";
import train from "../assets/images/1-1/train.png";
import { DataManager } from "../manager/data-manager";
import {
  ASSET_KEYS,
  FONT_KEYS,
  SCENE_KEYS,
  SIZING,
  TEXTURE_KEYS,
} from "../variables";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  public preload(): void {
    // Load fonts
    this.load.font(FONT_KEYS.REGULAR, VigaFont);

    // Chapter 1 assets
    this.load.image(ASSET_KEYS.ALARM, alarm);
    this.load.image(ASSET_KEYS.SCROLL, scroll);
    this.load.image(ASSET_KEYS.TOOTHBRUSH, toothbrush);
    this.load.image(ASSET_KEYS.BACKPACK, backpack);
    this.load.image(ASSET_KEYS.TRAIN, train);
    this.load.image(ASSET_KEYS.CHAPTER_1_PRELUDE, chapter1Prelude);

    const dm = DataManager.getInstance();

    // Generate button textures
    // Buttons
    const graphics = new Phaser.GameObjects.Graphics(this);
    this._drawRoundedRectangle(
      graphics,
      TEXTURE_KEYS.BUTTON,
      SIZING.BUTTON_WIDTH,
      SIZING.BUTTON_HEIGHT,
      6,
      0x11aaaa,
    );
    this._drawRoundedRectangle(
      graphics,
      TEXTURE_KEYS.BUTTON_DISABLED,
      SIZING.BUTTON_WIDTH,
      SIZING.BUTTON_HEIGHT,
      6,
      0xdddddd,
    );
    // Panel slots
    this._drawShape(
      graphics,
      TEXTURE_KEYS.SQUARE,
      dm.getPanelSlotSizes(TEXTURE_KEYS.SQUARE)!.width,
      dm.getPanelSlotSizes(TEXTURE_KEYS.SQUARE)!.height,
      0xffffff,
    );
    this._drawShape(
      graphics,
      TEXTURE_KEYS.TWO_THIRDS_RECTANGLE,
      dm.getPanelSlotSizes(TEXTURE_KEYS.TWO_THIRDS_RECTANGLE)!.width,
      dm.getPanelSlotSizes(TEXTURE_KEYS.TWO_THIRDS_RECTANGLE)!.height,
      0xffffff,
    );
    this._drawShape(
      graphics,
      TEXTURE_KEYS.HALF_RECTANGLE,
      dm.getPanelSlotSizes(TEXTURE_KEYS.HALF_RECTANGLE)!.width,
      dm.getPanelSlotSizes(TEXTURE_KEYS.HALF_RECTANGLE)!.height,
      0xffffff,
    );
    this._drawShape(
      graphics,
      TEXTURE_KEYS.FULL_RECTANGLE,
      dm.getPanelSlotSizes(TEXTURE_KEYS.FULL_RECTANGLE)!.width,
      dm.getPanelSlotSizes(TEXTURE_KEYS.FULL_RECTANGLE)!.height,
      0xffffff,
    );
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.TITLE);
  }

  private _drawRoundedRectangle(
    graphics: Phaser.GameObjects.Graphics,
    key: string,
    width: number,
    height: number,
    radius: number,
    fillColor: number,
  ) {
    graphics.clear();
    graphics
      .fillStyle(fillColor, 1)
      .fillRoundedRect(0, 0, width, height, radius);
    graphics.generateTexture(key, width, height);
  }

  private _drawShape(
    graphics: Phaser.GameObjects.Graphics,
    key: string,
    width: number,
    height: number,
    fillColor: number,
  ) {
    graphics.clear();
    graphics.lineStyle(2, 0x000000, 1);
    graphics.fillStyle(fillColor, 1).fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
  }
}
