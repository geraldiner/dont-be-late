import NotoSerifFont from "../assets/fonts/NotoSerif-VariableFont_wdth,wght.ttf";
import HeaderEndgame from "../assets/images/headers/header_endgame.jpg";
import HeaderForest from "../assets/images/headers/header_forest.jpg";
import HeaderSchool from "../assets/images/headers/header_school.jpg";
import IconClock from "../assets/images/icons/icon_clock.png";
import IconDisappointedEmoji from "../assets/images/icons/icon_disappointed_emoji.png";
import IconList from "../assets/images/icons/icon_list.png";
import IconMedalFirst from "../assets/images/icons/icon_medal_first.png";
import IconSixDots from "../assets/images/icons/icon_six_dots.png";
import IconStar from "../assets/images/icons/icon_star.png";
import IconThreeDots from "../assets/images/icons/icon_three_dots.png";
import IconTriangularRuler from "../assets/images/icons/icon_triangular_ruler.png";
import IconTrophy from "../assets/images/icons/icon_trophy.png";
import {
  ASSET_KEYS,
  COLORS,
  FONT_KEYS,
  SCENE_KEYS,
  SIZES,
  TEXTURE_KEYS,
} from "../variables";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  public preload(): void {
    // Load font
    this.load.font(FONT_KEYS.SERIF, NotoSerifFont);

    // Load images
    this.load.image(ASSET_KEYS.HEADER_ENDGAME, HeaderEndgame);
    this.load.image(ASSET_KEYS.HEADER_FOREST, HeaderForest);
    this.load.image(ASSET_KEYS.HEADER_SCHOOL, HeaderSchool);
    this.load.image(ASSET_KEYS.ICON_CLOCK, IconClock);
    this.load.image(ASSET_KEYS.ICON_DISAPPOINTED_EMOJI, IconDisappointedEmoji);
    this.load.image(ASSET_KEYS.ICON_LIST, IconList);
    this.load.image(ASSET_KEYS.ICON_MEDAL_FIRST, IconMedalFirst);
    this.load.image(ASSET_KEYS.ICON_SIX_DOTS, IconSixDots);
    this.load.image(ASSET_KEYS.ICON_STAR, IconStar);
    this.load.image(ASSET_KEYS.ICON_THREE_DOTS, IconThreeDots);
    this.load.image(ASSET_KEYS.ICON_TRIANGULAR_RULER, IconTriangularRuler);
    this.load.image(ASSET_KEYS.ICON_TROPHY, IconTrophy);

    // Generate button textures
    // Buttons
    const graphics = new Phaser.GameObjects.Graphics(this);
    this._drawRoundedRectangle(
      graphics,
      TEXTURE_KEYS.BUTTON,
      SIZES.BUTTON_WIDTH,
      SIZES.BUTTON_HEIGHT,
      6,
      COLORS.WHITE,
    );
    this._drawRoundedRectangle(
      graphics,
      TEXTURE_KEYS.BUTTON_DISABLED,
      SIZES.BUTTON_WIDTH,
      SIZES.BUTTON_HEIGHT,
      6,
      COLORS.GRAY,
    );

    // Top rounded rectangle for agenda heading
    this._drawAgendaHeadingShape(
      graphics,
      TEXTURE_KEYS.AGENDA_HEADING_ROUNDED_RECTANGLE,
      380,
      40,
      6,
      0xf5f4f0,
    );
    // Bottom rounded rectangle for agenda summary
    this._drawAgendaSummaryShape(
      graphics,
      TEXTURE_KEYS.AGENDA_SUMMARY_ROUNDED_RECTANGLE,
      380,
      80,
      6,
      0xf5f4f0,
    );
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.TITLE);
  }

  private _drawAgendaHeadingShape(
    graphics: Phaser.GameObjects.Graphics,
    key: string,
    width: number,
    height: number,
    radius: number,
    fillColor: number,
  ) {
    graphics.clear();
    graphics
      .lineStyle(2, 0xe5e7eb, 1)
      .fillStyle(fillColor, 1)
      .fillRoundedRect(0, 0, width, height, {
        tl: radius,
        tr: radius,
        bl: 0,
        br: 0,
      })
      .strokeRoundedRect(0, 0, width, height, {
        tl: radius,
        tr: radius,
        bl: 0,
        br: 0,
      });
    graphics.generateTexture(key, width, height);
  }

  private _drawAgendaSummaryShape(
    graphics: Phaser.GameObjects.Graphics,
    key: string,
    width: number,
    height: number,
    radius: number,
    fillColor: number,
  ) {
    graphics.clear();
    graphics
      .lineStyle(2, 0xe5e7eb, 1)
      .fillStyle(fillColor, 1)
      .fillRoundedRect(0, 0, width, height, {
        tl: 0,
        tr: 0,
        bl: radius,
        br: radius,
      })
      .strokeRoundedRect(0, 0, width, height, {
        tl: 0,
        tr: 0,
        bl: radius,
        br: radius,
      });
    graphics.generateTexture(key, width, height);
  }

  private _drawRoundedRectangle(
    graphics: Phaser.GameObjects.Graphics,
    key: string,
    width: number,
    height: number,
    radius: number,
    fillColor: number,
  ) {
    graphics.clear();
    graphics
      .lineStyle(2, COLORS.LIGHT_GRAY, 1)
      .fillStyle(fillColor, 1)
      .fillRoundedRect(0, 0, width, height, radius)
      .strokeRoundedRect(0, 0, width, height, radius);
    graphics.generateTexture(key, width, height);
  }
}
