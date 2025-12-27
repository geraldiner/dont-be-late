import { SCENE_KEYS } from "../../variables";
import { Link } from "./link";

export class ContinueLink extends Link {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "▶ Continue");
  }

  onClick(): void {
    this.playSound();
    this.scene.scene.start(SCENE_KEYS.LEVEL_SELECT);
  }
}
