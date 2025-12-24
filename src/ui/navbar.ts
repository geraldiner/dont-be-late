import {
  ASSET_KEYS,
  COLORS,
  FONT_KEYS,
  FONT_SIZES,
  PADDING,
  SIZES,
} from "../variables";

export class Navbar extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    crumbs: Array<string>,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = scene.add.rectangle(
      scene.game.canvas.width / 2,
      y,
      SIZES.PAGE_WIDTH,
      SIZES.NAVBAR_HEIGHT,
      COLORS.WHITE.number,
    );

    const menuIcon = scene.add
      .image(
        bg.x - bg.width / 2 + PADDING.TEN + SIZES.ICON / 2,
        bg.y,
        ASSET_KEYS.ICON_LIST,
      )
      .setDisplaySize(SIZES.ICON, SIZES.ICON);

    const breadcrumbText = scene.add
      .text(
        menuIcon.x + menuIcon.displayWidth + PADDING.TEN,
        bg.y,
        crumbs.join(" / "),
        {
          fontFamily: FONT_KEYS.SERIF,
          fontSize: FONT_SIZES.DEFAULT,
          color: COLORS.BLACK.hex,
        },
      )
      .setOrigin(0, 0.5);

    const iconsContainer = scene.add.container(
      bg.width + PADDING.THIRTY,
      bg.height / 2,
      [],
    );

    const clockIcon = scene.add
      .image(0, 0, ASSET_KEYS.ICON_CLOCK)
      .setDisplaySize(SIZES.ICON, SIZES.ICON);
    const starIcon = scene.add
      .image(
        clockIcon.x + clockIcon.displayWidth + PADDING.TEN,
        0,
        ASSET_KEYS.ICON_STAR,
      )
      .setDisplaySize(SIZES.ICON, SIZES.ICON);
    const threeDotsIcon = scene.add
      .image(
        starIcon.x + starIcon.displayWidth + PADDING.TEN,
        0,
        ASSET_KEYS.ICON_THREE_DOTS,
      )
      .setDisplaySize(SIZES.ICON, SIZES.ICON);

    iconsContainer.add([clockIcon, starIcon, threeDotsIcon]);

    this.add([bg, menuIcon, breadcrumbText, iconsContainer]);
  }
}
