import { GameManager } from "../../manager/game_manager";
import { Button } from "./button";

export class ResetButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y, text);
  }

  onClick(): void {
    const gm = GameManager.getInstance();
    gm.resetLevel(this.scene);
  }
}
