import { GameManager } from "../../manager/game_manager";
import { Button } from "./button";

export class LetsGoButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "Let's Go!");
  }

  onClick(): void {
    const gm = GameManager.getInstance();
    gm.showOutcomeScreen(this.scene);
  }
}
