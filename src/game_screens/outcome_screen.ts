import { GameManager } from "../manager/game_manager";
import { NextButton, ResetButton } from "../ui/buttons";
import { FONT_KEYS, OUTCOMES, PADDING, SIZES } from "../variables";

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
        fontFamily: FONT_KEYS.SERIF,
        fontSize: "48px",
        color: "#000000",
        align: "center",
      })
      .setOrigin(0.5);

    const nextButton = new NextButton(
      scene,
      0,
      text.y + text.height + PADDING.TWENTY,
    );

    const resetButton = new ResetButton(
      scene,
      0,
      failed
        ? text.height + PADDING.TWENTY
        : nextButton.y + SIZES.BUTTON_HEIGHT + PADDING.TWENTY * 2,
      failed ? "Try Again" : "Run it Back",
    );

    this.add([bg, text, resetButton]);
    if (!failed) {
      this.add(nextButton);
    }
    this.setPosition(width / 2, height / 2);
  }
}
