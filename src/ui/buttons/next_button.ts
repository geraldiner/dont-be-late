import { GameManager } from "../../manager/game_manager";
import { SCENE_KEYS } from "../../variables";
import { Button } from "./button";

export class NextButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "Next");
  }

  onClick(): void {
    const gm = GameManager.getInstance();
    gm.advanceLevel();
    if (gm.shouldGoToEndGame()) {
      this.scene.scene.start(SCENE_KEYS.GAME_COMPLETE);
    } else {
      this.scene.scene.start(SCENE_KEYS.PROLOGUE);
    }
  }
}
