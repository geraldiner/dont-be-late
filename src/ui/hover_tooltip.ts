import { COLORS, FONT_KEYS, FONT_SIZES, PADDING, SIZES } from "../variables";

export class HoverTooltip extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    wordWrap?: Phaser.Types.GameObjects.Text.TextWordWrap,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = scene.add
      .rectangle(
        0,
        0,
        SIZES.BUTTON_WIDTH,
        SIZES.BUTTON_HEIGHT,
        COLORS.WHITE.number,
      )
      .setStrokeStyle(1, COLORS.BLACK.number);

    const label = scene.add
      .text(bg.x - bg.width / 2 + PADDING.TEN / 2, 0, text, {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: FONT_SIZES.DEFAULT,
        color: COLORS.BLACK.hex,
        align: "left",
        wordWrap,
      })
      .setOrigin(0, 0.5);
    label.setSize(label.width, label.height);

    bg.setSize(label.width + PADDING.TEN, label.height + PADDING.TEN);
    bg.setPosition(bg.x + PADDING.TEN, bg.y + bg.height / 2);
    label.setPosition(bg.x + PADDING.TEN / 2, bg.y).setOrigin(0.5);

    this.add([bg, label]);
    this.setSize(bg.width, bg.height);
    this.setVisible(false);
    this.setDepth(1000);
  }

  public show(): void {
    this.setVisible(true);
  }

  public hide(): void {
    this.setVisible(false);
  }
}
