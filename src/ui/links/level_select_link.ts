import { SCENE_KEYS } from "../../variables";
import { Link } from "./link";

export class LevelSelectLink extends Link {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "▶ Level Select");
  }

  onClick(): void {
    this.playSound();
    this.scene.tweens.add({
      targets: [this.scene.cameras.main],
      duration: 777,
      y: { from: 0, to: 600 },
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.scene.scene.start(SCENE_KEYS.LEVEL_SELECT);
      },
    });
  }
}
