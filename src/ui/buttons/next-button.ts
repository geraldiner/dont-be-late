import { GameManager } from "../../manager/game-manager";
import { Button } from "./button";

export class NextButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "Next");
  }

  onClick(): void {
    const gm = GameManager.getInstance();
    gm.goNextLevel(this.scene);
  }
}
