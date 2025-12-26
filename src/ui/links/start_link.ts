import { GameManager } from "../../manager/game_manager";
import { SCENE_KEYS } from "../../variables";
import { Link } from "./link";

export class StartLink extends Link {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "▶ Start");
  }

  onClick(): void {
    this.playSound();
    const gm = GameManager.getInstance();
    gm.setupLevel();
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
