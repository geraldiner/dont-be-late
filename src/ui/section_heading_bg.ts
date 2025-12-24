import { COLORS, FONT_KEYS, FONT_SIZES, PADDING, SIZES } from "../variables";

export class SectionHeadingWithBackground extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    width: number,
    color: number,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = scene.add.rectangle(0, 0, width, SIZES.TITLE_BG_HEIGHT, color);

    const label = scene.add
      .text(bg.x - bg.width / 2 + PADDING.TWENTY, bg.y, text, {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: FONT_SIZES.H3,
        fontStyle: "bold",
        color: COLORS.BLACK.hex,
      })
      .setOrigin(0, 0.5);

    this.add([bg, label]);
    this.setSize(bg.width, bg.height);
  }
}
