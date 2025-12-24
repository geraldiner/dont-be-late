import { SCENE_KEYS } from "../../variables";
import { Link } from "./link";

export class MainMenuLink extends Link {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "▶ Main Menu");
  }

  onClick(): void {
    this.scene.scene.start(SCENE_KEYS.TITLE);
  }
}
