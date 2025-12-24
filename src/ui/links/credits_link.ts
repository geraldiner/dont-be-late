import { SCENE_KEYS } from "../../variables";
import { Link } from "./link";

export class CreditsLink extends Link {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "▶ Credits");
  }

  onClick(): void {
    this.scene.scene.start(SCENE_KEYS.CREDITS);
  }
}
