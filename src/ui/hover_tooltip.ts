import { COLORS, FONT_KEYS, FONT_SIZES, PADDING, SIZES } from "../variables";

export class HoverTooltip extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
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
      .text(0, 0, text, {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: FONT_SIZES.DEFAULT,
        color: COLORS.BLACK.hex,
      })
      .setOrigin(0.5);
    label.setSize(label.width + PADDING.TEN, label.height + PADDING.TEN);

    bg.setSize(
      Math.max(bg.width, label.width),
      Math.max(bg.height, label.height),
    );

    this.add([bg, label]);
    this.setSize(bg.width, bg.height);
    this.setVisible(false);
  }

  public show(): void {
    this.setVisible(true);
  }

  public hide(): void {
    this.setVisible(false);
  }
}
