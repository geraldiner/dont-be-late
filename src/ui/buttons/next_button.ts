import { GameManager } from "../../manager/game_manager";
import { SCENE_KEYS } from "../../variables";
import { Button } from "./button";

export class NextButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "Next");
  }

  onClick(): void {
    const gm = GameManager.getInstance();
    gm.advanceLevel();
    this.scene.tweens.add({
      targets: [this.scene.cameras.main],
      duration: 777,
      y: { from: 0, to: 600 },
      ease: "Sine.easeInOut",
      onComplete: () => {
        if (gm.shouldGoToEndGame()) {
          this.scene.scene.start(SCENE_KEYS.GAME_COMPLETE);
        } else {
          gm.setupLevel();
          this.scene.scene.start(SCENE_KEYS.PROLOGUE);
        }
      },
    });
  }
}
