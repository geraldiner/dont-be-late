import { ASSET_KEYS, COLORS, PADDING, SIZES } from "../variables";

export class Navbar extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string | Array<string>,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = scene.add.rectangle(
      scene.game.canvas.width / 2,
      y,
      SIZES.PAGE_WIDTH,
      SIZES.NAVBAR_HEIGHT,
      COLORS.WHITE,
    );

    const menuIcon = scene.add
      .image(
        scene.game.canvas.width / 2 - SIZES.PAGE_WIDTH / 2 + PADDING.TEN,
        y + SIZES.NAVBAR_HEIGHT / 2,
        ASSET_KEYS.ICON_LIST,
      )
      .setDisplaySize(SIZES.ICON, SIZES.ICON);

    this.add([bg, menuIcon]);
  }
}
