import { COLORS, FONT_KEYS, FONT_SIZES, SIZES } from "../variables";

export class Paragraph extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    fontFamily?: string,
    color?: string,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    const paragraphText = scene.add.text(
      x - SIZES.COLUMN_ONE_WIDTH / 2,
      0,
      text,
      {
        fontFamily: fontFamily ?? FONT_KEYS.SERIF,
        fontSize: FONT_SIZES.DEFAULT,
        color: color ?? COLORS.BLACK.hex,
        wordWrap: { width: SIZES.COLUMN_ONE_WIDTH },
      },
    );

    this.add(paragraphText);
    this.setSize(SIZES.COLUMN_ONE_WIDTH, paragraphText.height);
  }
}
