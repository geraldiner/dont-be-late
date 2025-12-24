import { SCENE_KEYS } from "../../variables";
import { Button } from "./button";

export class ResetButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y, text);
  }

  onClick(): void {
    this.scene.scene.start(SCENE_KEYS.GAME);
  }
}
