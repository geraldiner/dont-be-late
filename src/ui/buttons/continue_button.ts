import { SCENE_KEYS } from "../../variables";
import { Button } from "./button";

export class ContinueButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "Continue");
  }

  onClick(): void {
    this.playSound();
    this.scene.tweens.add({
      targets: [this.scene.cameras.main],
      duration: 777,
      y: { from: 0, to: 600 },
      ease: "Sine.easeInOut",
    });
    this.scene.scene.start(SCENE_KEYS.GAME);
  }
}
