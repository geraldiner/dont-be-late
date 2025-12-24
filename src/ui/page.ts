import { COLORS, FONT_KEYS, FONT_SIZES, PADDING, SIZES } from "../variables";

export class Page extends Phaser.GameObjects.Container {
  private _childrenContainer: Phaser.GameObjects.Container;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    iconKey: string,
    title: string,
    accentImageKey: string,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = scene.add.rectangle(
      scene.game.canvas.width / 2,
      y,
      SIZES.PAGE_WIDTH,
      SIZES.PAGE_HEIGHT,
      COLORS.WHITE.number,
    );

    // DEBUG: Content rectangle should be content container?
    const contentContainer = scene.add.container(
      bg.x - bg.width / 2,
      bg.y - bg.height / 2,
      [],
    );

    const pageIcon = scene.add
      .image(contentContainer.x, bg.y - bg.height / 2, iconKey)
      .setOrigin(0)
      .setDisplaySize(SIZES.PAGE_ICON, SIZES.PAGE_ICON);

    const pageTitle = scene.add.text(
      contentContainer.x,
      pageIcon.y + SIZES.PAGE_ICON + PADDING.TWENTY,
      title,
      {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: FONT_SIZES.H1,
        color: COLORS.BLACK.hex,
      },
    );

    const accentImage = scene.add.image(
      SIZES.CONTENT_WIDTH + SIZES.COLUMN_GAP,
      SIZES.PAGE_HEIGHT - SIZES.ACCENT_IMAGE_HEIGHT / 2,
      accentImageKey,
    );

    const childrenContainer = scene.add.container(
      bg.x - bg.width / 2,
      pageTitle.y + pageTitle.height + PADDING.FORTY,
    );
    this._childrenContainer = childrenContainer;

    contentContainer.add([pageIcon, pageTitle, accentImage, childrenContainer]);

    this.add([bg, contentContainer]);
  }

  public addChild(child: Phaser.GameObjects.Container): void {
    console.log(this._childrenContainer.getAll());
    const children = this._childrenContainer.getAll();
    let nextY = 0;
    if (children) {
      const lastChild = children[children.length - 1];
      if (lastChild) {
        nextY = lastChild.y + lastChild.height + PADDING.TEN;
      }
    }
    child.setPosition(child.x, nextY);
    this._childrenContainer.add(child);
  }
}
