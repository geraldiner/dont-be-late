import { SCENE_KEYS } from "../../variables";
import { Button } from "./button";

export class ResetButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y, text);
  }

  onClick(): void {
    this.playSound();
    this.scene.tweens.add({
      targets: [this.scene.cameras.main],
      duration: 777,
      y: { from: 0, to: 600 },
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.scene.scene.start(SCENE_KEYS.PROLOGUE);
      },
    });
  }
}
