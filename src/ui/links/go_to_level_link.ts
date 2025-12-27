import { GameManager } from "../../manager/game_manager";
import { SCENE_KEYS } from "../../variables";
import { Link } from "./link";

export class GoToLevelLink extends Link {
  private chapterNum: number;
  private levelNum: number;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    chapterNum: number,
    levelNum: number,
    label: string,
  ) {
    super(scene, x, y, label);
    this.chapterNum = chapterNum;
    this.levelNum = levelNum;
  }

  onClick(): void {
    this.playSound();
    const gm = GameManager.getInstance();
    gm.chapter = this.chapterNum;
    gm.level = this.levelNum;
    gm.setupLevel();
    this.scene.scene.start(SCENE_KEYS.PROLOGUE);
  }
}
