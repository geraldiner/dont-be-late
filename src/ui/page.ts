import { COLORS, FONT_KEYS, FONT_SIZES, PADDING, SIZES } from "../variables";

export class Page extends Phaser.GameObjects.Container {
  private _childrenContainer: Phaser.GameObjects.Container;
  private _sidebarContainer: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    iconKey: string,
    title: string,
    accentImageKey?: string,
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

    if (accentImageKey) {
      const accentImage = scene.add.image(
        SIZES.CONTENT_WIDTH + SIZES.COLUMN_GAP,
        SIZES.PAGE_HEIGHT - SIZES.ACCENT_IMAGE_HEIGHT / 2,
        accentImageKey,
      );
      contentContainer.add(accentImage);
    }

    const childrenContainer = scene.add.container(
      bg.x - bg.width / 2,
      pageTitle.y + pageTitle.height + PADDING.FORTY,
      [],
    );
    this._childrenContainer = childrenContainer;

    const sidebarContainer = scene.add.container(0, 0, []);
    this._sidebarContainer = sidebarContainer;

    contentContainer.add([pageIcon, pageTitle, childrenContainer]);

    this.add([bg, contentContainer]);
  }

  public addChild(child: Phaser.GameObjects.Container, padding?: number): void {
    const lastChild = this._childrenContainer.getAt(
      this._childrenContainer.length - 1,
    );
    let nextY = 0;
    if (lastChild) {
      nextY = lastChild.y + lastChild.height + (padding ?? PADDING.THIRTY);
    }
    child.setPosition(child.x, nextY);
    this._childrenContainer.add(child);
  }
}
