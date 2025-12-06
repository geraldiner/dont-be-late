import * as Phaser from "phaser";

import { SCENE_KEYS } from "../variables";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.GAME);
  }
}
