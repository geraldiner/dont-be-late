import { GameManager } from "../../manager/game_manager";
import { SCENE_KEYS } from "../../variables";
import { Button } from "./button";

export class LetsGoButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "Let's Go!");
  }

  onClick(): void {
    this.playSound();
    const gm = GameManager.getInstance();
    gm.updateOutcome();
    this.scene.tweens.add({
      targets: [this.scene.cameras.main],
      duration: 777,
      y: { from: 0, to: 600 },
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.scene.scene.start(SCENE_KEYS.OUTCOME);
      },
    });
  }
}
