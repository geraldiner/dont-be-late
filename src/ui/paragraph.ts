import { COLORS, FONT_KEYS, FONT_SIZES } from "../variables";

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

    const paragraphText = scene.add.text(0, 0, text, {
      fontFamily: fontFamily ?? FONT_KEYS.SERIF,
      fontSize: FONT_SIZES.DEFAULT,
      color: color ?? COLORS.BLACK.hex,
    });

    this.add(paragraphText);
    this.setSize(this.width, paragraphText.height);
  }
}
