import * as Phaser from "phaser";

import { FONT_KEYS, SCENE_KEYS } from "../variables";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  public create(): void {
    // DEBUG: Uncomment out to skip title scene
    this.scene.start(SCENE_KEYS.GAME);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 40,
        "Don't Be Late!",
        {
          fontFamily: FONT_KEYS.REGULAR,
          fontSize: "48px",
          color: "#000000",
        },
      )
      .setOrigin(0.5);

    const clickToStartText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 40,
        "Click to Start",
        {
          fontFamily: FONT_KEYS.REGULAR,
          fontSize: "24px",
          color: "#000000",
        },
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.cameras.main.fadeOut(500, 255, 255, 255, (_, progress: number) => {
          if (progress !== 1) {
            return;
          }
          this.scene.start(SCENE_KEYS.GAME);
        });
      });

    this.tweens.add({
      targets: clickToStartText,
      alpha: { from: 1, to: 0 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
  }
}
