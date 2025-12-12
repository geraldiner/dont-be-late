import * as Phaser from "phaser";

import { DataManager } from "../manager/data-manager";
import { GameManager } from "../manager/game-manager";
import { FONT_KEYS, SIZING } from "../variables";

export class PreludeScreen extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.cameras.main.fadeIn(500, 255, 255, 255);
    scene.add.existing(this);
    this.setDepth(1200);

    const dm = DataManager.getInstance();
    const gm = GameManager.getInstance();

    const [width, height] = [scene.game.canvas.width, scene.game.canvas.height];

    const bg = scene.add
      .rectangle(0, 0, width, height, 0xffffff)
      .setOrigin(0.5);

    const chapterData = dm.getChapterData(gm.chapter);
    const levelData = chapterData.levels[gm.level - 1];

    const title = scene.add
      .text(0, -60, "Don't Be Late for...", {
        fontSize: "32px",
        color: "#000000",
        align: "center",
        fontFamily: FONT_KEYS.REGULAR,
      })
      .setOrigin(0.5);

    const text = scene.add
      .text(0, 0, `${chapterData.title} ${gm.chapter}-${gm.level}`, {
        fontSize: "48px",
        color: "#000000",
        align: "center",
        fontFamily: FONT_KEYS.REGULAR,
      })
      .setOrigin(0.5);

    const subTexts = levelData.sceneStartText.map(
      (line: string, index: number) => {
        return scene.add
          .text(0, 60 + index * SIZING.PADDING * 4, line, {
            fontSize: "24px",
            color: "#000000",
            align: "center",
            fontFamily: FONT_KEYS.REGULAR,
          })
          .setOrigin(0.5);
      },
    );

    this.add([bg, title, text, ...subTexts]);
    this.setPosition(width / 2, height / 2);

    const [centerX, _] = [
      scene.game.canvas.width / 2,
      scene.game.canvas.height / 2,
    ];

    const tween = scene.tweens.add({
      targets: this,
      x: -centerX,
      duration: 1500,
      ease: "Power2",
      delay: 3000,
    });

    tween.on("complete", () => {
      this.destroy();
    });
  }
}
