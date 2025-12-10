import * as Phaser from "phaser";

import alarm from "../assets/images/1-1/alarm.png";
import backpack from "../assets/images/1-1/backpack.png";
import chapter1Prelude from "../assets/images/1-1/prelude.jpg";
import scroll from "../assets/images/1-1/scroll.png";
import toothbrush from "../assets/images/1-1/toothbrush.png";
import train from "../assets/images/1-1/train.png";
import { ASSET_KEYS, SCENE_KEYS } from "../variables";

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
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.TITLE);
  }
}
