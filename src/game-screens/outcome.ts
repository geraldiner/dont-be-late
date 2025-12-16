import { GameManager } from "../manager/game-manager";
import { NextButton, ResetButton } from "../ui/buttons";
import { FONT_KEYS, OUTCOMES, SIZING } from "../variables";

export class OutcomeScreen extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setDepth(1200);
    const gm = GameManager.getInstance();
    const outcome = gm.outcome;
    const failed = gm.outcome === OUTCOMES.LATE || gm.outcome === OUTCOMES.FAIL;

    const [width, height] = [scene.game.canvas.width, scene.game.canvas.height];

    const bg = scene.add
      .rectangle(0, 0, width, height, 0xffffff)
      .setOrigin(0.5);

    const text = scene.add
      .text(0, 0, `${outcome}`, {
        fontFamily: FONT_KEYS.REGULAR,
        fontSize: "48px",
        color: "#000000",
        align: "center",
      })
      .setOrigin(0.5);

    const nextButton = new NextButton(
      scene,
      0,
      text.y + text.height + SIZING.PADDING * 2,
    );

    const resetButton = new ResetButton(
      scene,
      0,
      failed
        ? text.height + SIZING.PADDING
        : nextButton.y + SIZING.BUTTON_HEIGHT + SIZING.PADDING * 2,
      failed ? "Try Again" : "Run it Back",
    );

    this.add([bg, text, resetButton]);
    if (!failed) {
      this.add(nextButton);
    }
    this.setPosition(width / 2, height / 2);
  }
}
