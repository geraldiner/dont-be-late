import { COLORS, FONT_KEYS, FONT_SIZES, PADDING, SIZES } from "../variables";

export class SectionHeadingWithDivider extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y);
    scene.add.existing(this);

    const headingText = scene.add.text(0, 0, text, {
      fontFamily: FONT_KEYS.SERIF,
      fontSize: FONT_SIZES.H2,
      color: COLORS.BLACK.hex,
    });

    const divider = scene.add
      .line(
        headingText.x,
        headingText.y + headingText.height + PADDING.TEN,
        headingText.x,
        0,
        SIZES.COLUMN_ONE_WIDTH,
        0,
        COLORS.GRAY.number,
      )
      .setOrigin(0);

    this.add([headingText, divider]);
    this.setSize(this.width, headingText.height + divider.height + PADDING.TEN);
  }
}
