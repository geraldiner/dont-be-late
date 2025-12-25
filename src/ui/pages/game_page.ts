import { GameManager } from "../../manager/game_manager";
import { formatTime } from "../../utils";
import { COLORS, FONT_KEYS, FONT_SIZES, PADDING, SIZES } from "../../variables";
import { LetsGoButton } from "../buttons";
import { SectionHeadingWithBackground } from "../section_heading_bg";
import { Page } from "./page";

export class GamePage extends Page {
  public columnOneX: number = 0;
  public startY: number = 0;
  public letsGoButton: LetsGoButton;
  private currentTimeText: Phaser.GameObjects.Text = null!;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    crumbs: Array<string>,
    accentImageKey: string,
    color: number,
  ) {
    super(scene, x, y, crumbs);
    scene.add.existing(this);

    const gm = GameManager.getInstance();

    const navbarDivider = scene.add.rectangle(
      scene.game.canvas.width / 2,
      this.navbar.y + SIZES.NAVBAR_HEIGHT,
      this.navbar.width,
      2,
      COLORS.GRAY.number,
    );

    const bg = scene.add.rectangle(
      scene.game.canvas.width / 2,
      this.navbar.y + SIZES.NAVBAR_HEIGHT + SIZES.PAGE_GAME_HEIGHT / 2,
      SIZES.PAGE_WIDTH,
      SIZES.PAGE_GAME_HEIGHT,
      COLORS.WHITE.number,
    );

    const accentImage = scene.add
      .image(
        bg.x +
          SIZES.PAGE_WIDTH / 2 -
          SIZES.ACCENT_IMAGE_WIDTH -
          PADDING.ONE_TWENTY,
        bg.y,
        accentImageKey,
      )
      .setOrigin(0);

    const columnOneContainer = scene.add
      .container(
        bg.x + PADDING.ONE_TWENTY - SIZES.PAGE_WIDTH / 2,
        bg.y - SIZES.PAGE_GAME_HEIGHT / 2 + PADDING.TWENTY,
        [],
      )
      .setDepth(200);
    columnOneContainer.setSize(SIZES.COLUMN_ONE_WIDTH, 0);
    const agendaHeading = new SectionHeadingWithBackground(
      scene,
      columnOneContainer.width / 2,
      PADDING.TWENTY,
      "today's agenda",
      SIZES.COLUMN_ONE_WIDTH,
      color,
    );
    this.columnOneX = columnOneContainer.x;
    this.startY = columnOneContainer.y + PADDING.TWENTY + agendaHeading.height;

    const letsGoButton = new LetsGoButton(
      scene,
      columnOneContainer.width / 2,
      columnOneContainer.y +
        SIZES.PAGE_GAME_HEIGHT -
        PADDING.ONE_TWENTY -
        PADDING.TWENTY,
    );
    letsGoButton.setIsDisabled(true)
    this.letsGoButton = letsGoButton;

    columnOneContainer.add([agendaHeading, letsGoButton]);

    const columnTwoContainer = scene.add.container(
      accentImage.x,
      columnOneContainer.y,
      [],
    );

    columnTwoContainer.setSize(SIZES.COLUMN_TWO_WIDTH, 0);
    const currentTimeHeading = new SectionHeadingWithBackground(
      scene,
      columnTwoContainer.width / 2,
      PADDING.TWENTY,
      "current time",
      SIZES.COLUMN_TWO_WIDTH,
      color,
    );

    const currentTimeText = scene.add
      .text(
        0,
        currentTimeHeading.y + currentTimeHeading.height + PADDING.TEN,
        formatTime(gm.currentTime),
        {
          fontFamily: FONT_KEYS.SERIF,
          fontSize: FONT_SIZES.DEFAULT,
          color: COLORS.BLACK.hex,
        },
      )
      .setOrigin(0, 0.5)
      .setSize(SIZES.COLUMN_TWO_WIDTH, SIZES.TITLE_BG_HEIGHT);
    this.currentTimeText = currentTimeText;

    const targetTimeHeading = new SectionHeadingWithBackground(
      scene,
      columnTwoContainer.width / 2,
      currentTimeText.y + currentTimeText.height + PADDING.TWENTY,
      "target time",
      SIZES.COLUMN_TWO_WIDTH,
      color,
    );

    const targetTimeText = scene.add
      .text(
        0,
        targetTimeHeading.y + targetTimeHeading.height + PADDING.TEN,
        formatTime(gm.targetTime),
        {
          fontFamily: FONT_KEYS.SERIF,
          fontSize: FONT_SIZES.DEFAULT,
          color: COLORS.BLACK.hex,
        },
      )
      .setOrigin(0, 0.5)
      .setSize(SIZES.COLUMN_TWO_WIDTH, SIZES.TITLE_BG_HEIGHT);

    columnTwoContainer.add([
      currentTimeHeading,
      currentTimeText,
      targetTimeHeading,
      targetTimeText,
    ]);

    this.add([
      navbarDivider,
      bg,
      columnOneContainer,
      columnTwoContainer,
      accentImage,
    ]);
  }

  public updateCurrentTimeText(): void {
    const gm = GameManager.getInstance();
    this.currentTimeText.setText(formatTime(gm.currentTime));
    if (gm.currentTime.getTime() > gm.targetTime.getTime()) {
      this.currentTimeText.setColor("#b31515ff");
    } else {
      this.currentTimeText.setColor("#2cb335ff");
    }
  }
}
