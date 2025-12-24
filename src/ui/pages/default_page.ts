import { COLORS, FONT_KEYS, FONT_SIZES, PADDING, SIZES } from "../../variables";
import { Header } from "../header";
import { Page } from "./page";

export class DefaultPage extends Page {
  private _childrenContainer: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    crumbs: Array<string>,
    headerImageKey: string,
    iconKey: string,
    title: string,
    accentImageKey: string,
  ) {
    super(scene, x, y, crumbs);
    scene.add.existing(this);

    const header = new Header(
      scene,
      x,
      this.navbar.y + SIZES.NAVBAR_HEIGHT,
      headerImageKey,
    );

    const contentBg = scene.add.rectangle(
      scene.game.canvas.width / 2,
      header.y + SIZES.HEADER_HEIGHT + SIZES.PAGE_DEFAULT_HEIGHT / 2 - 2,
      SIZES.PAGE_WIDTH,
      SIZES.PAGE_DEFAULT_HEIGHT,
      COLORS.WHITE.number,
    );

    const contentContainer = scene.add.container(
      contentBg.x - contentBg.width / 2 + PADDING.ONE_TWENTY,
      contentBg.y - contentBg.height / 2,
      [],
    );

    contentContainer.setSize(
      contentBg.displayWidth - 240,
      contentBg.displayHeight,
    );

    const pageIcon = scene.add
      .image(0, -SIZES.PAGE_ICON / 2, iconKey)
      .setOrigin(0)
      .setDisplaySize(SIZES.PAGE_ICON, SIZES.PAGE_ICON);

    const pageTitle = scene.add.text(
      0,
      pageIcon.y + SIZES.PAGE_ICON + PADDING.TWENTY,
      title,
      {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: FONT_SIZES.H1,
        color: COLORS.BLACK.hex,
      },
    );

    const accentImage = scene.add.image(
      SIZES.CONTENT_WIDTH - SIZES.ACCENT_IMAGE_WIDTH / 2,
      SIZES.PAGE_DEFAULT_HEIGHT - SIZES.ACCENT_IMAGE_HEIGHT / 2,
      accentImageKey,
    );

    const childrenContainer = scene.add.container(
      pageTitle.x,
      pageTitle.y + pageTitle.height + PADDING.FORTY,
      [],
    );
    childrenContainer.setSize(SIZES.COLUMN_ONE_WIDTH, 0);
    childrenContainer.setPosition(
      childrenContainer.x,
      childrenContainer.y + childrenContainer.height / 2,
    );

    this._childrenContainer = childrenContainer;

    contentContainer.add([pageIcon, pageTitle, accentImage, childrenContainer]);

    this.add([header, contentBg, contentContainer]);
  }

  public addChild(child: Phaser.GameObjects.Container, padding?: number): void {
    const lastChild = this._childrenContainer.getAt(
      this._childrenContainer.length - 1,
    );
    let nextY = 0;
    if (lastChild) {
      nextY = lastChild.y + lastChild.height + (padding ?? PADDING.TWENTY);
    }
    child.setPosition(child.width / 2, nextY);
    this._childrenContainer.add(child);
  }
}
