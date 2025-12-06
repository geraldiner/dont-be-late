import * as Phaser from "phaser";

import { SCENE_KEYS } from "../variables";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  public preload(): void {}

  public create(): void {
    this.scene.start(SCENE_KEYS.TITLE);
  }
}
