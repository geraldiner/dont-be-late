import * as Phaser from "phaser";

import { SCENE_KEYS } from "../variables";

export class GameCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAME_COMPLETE });
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.GAME_COMPLETE);
  }
}
