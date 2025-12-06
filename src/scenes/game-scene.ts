import * as Phaser from "phaser";

import { SCENE_KEYS } from "../variables";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  public create(): void {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Game Scene", {
        font: "48px Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }
}
