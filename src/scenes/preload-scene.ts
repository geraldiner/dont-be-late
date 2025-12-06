import * as Phaser from "phaser";

import alarmPlaceholder from "../assets/images/placeholders/Alarm.png";
import { ASSET_KEYS, SCENE_KEYS } from "../variables";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  public preload(): void {
    this.load.image(ASSET_KEYS.ALARM, alarmPlaceholder);
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.TITLE);
  }
}
