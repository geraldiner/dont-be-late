import * as Phaser from "phaser";

import alarm from "../assets/images/1-1/alarm.png";
import backpack from "../assets/images/1-1/backpack.png";
import chapter1Prelude from "../assets/images/1-1/prelude.jpg";
import scroll from "../assets/images/1-1/scroll.png";
import toothbrush from "../assets/images/1-1/toothbrush.png";
import train from "../assets/images/1-1/train.png";
import { ASSET_KEYS, SCENE_KEYS, SIZING } from "../variables";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  public preload(): void {
    this.load.image(ASSET_KEYS.ALARM, alarm);
    this.load.image(ASSET_KEYS.SCROLL, scroll);
    this.load.image(ASSET_KEYS.TOOTHBRUSH, toothbrush);
    this.load.image(ASSET_KEYS.BACKPACK, backpack);
    this.load.image(ASSET_KEYS.TRAIN, train);
    this.load.image(ASSET_KEYS.CHAPTER_1_PRELUDE, chapter1Prelude);

    const graphics = new Phaser.GameObjects.Graphics(this);
    this._drawRoundedRectangle(
      graphics,
      "button",
      SIZING.BUTTON_WIDTH,
      SIZING.BUTTON_HEIGHT,
      6,
      0x11aaaa,
    );
    this._drawRoundedRectangle(
      graphics,
      "button-disabled",
      SIZING.BUTTON_WIDTH,
      SIZING.BUTTON_HEIGHT,
      6,
      0xdddddd,
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
}
