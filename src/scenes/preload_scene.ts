import NotoSerifFont from "../assets/fonts/NotoSerif-VariableFont_wdth,wght.ttf";
import AccentEndgame from "../assets/images/accents/accent_endgame.png";
import AccentForest from "../assets/images/accents/accent_forest.png";
import AccentSchool from "../assets/images/accents/accent_school.png";
import HeaderEndgame from "../assets/images/headers/header_endgame.jpg";
import HeaderForest from "../assets/images/headers/header_forest.jpg";
import HeaderSchool from "../assets/images/headers/header_school.jpg";
import IconClock from "../assets/images/icons/icon_clock.png";
import IconDisappointedEmoji from "../assets/images/icons/icon_disappointed_emoji.png";
import IconHerb from "../assets/images/icons/icon_herb.png";
import IconList from "../assets/images/icons/icon_list.png";
import IconMedalFirst from "../assets/images/icons/icon_medal_first.png";
import IconSixDots from "../assets/images/icons/icon_six_dots_gray.png";
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
    this.load.image(ASSET_KEYS.ACCENT_FOREST, AccentForest);
    this.load.image(ASSET_KEYS.ACCENT_ENDGAME, AccentEndgame);
    this.load.image(ASSET_KEYS.ACCENT_SCHOOL, AccentSchool);
    this.load.image(ASSET_KEYS.HEADER_ENDGAME, HeaderEndgame);
    this.load.image(ASSET_KEYS.HEADER_FOREST, HeaderForest);
    this.load.image(ASSET_KEYS.HEADER_SCHOOL, HeaderSchool);
    this.load.image(ASSET_KEYS.ICON_CLOCK, IconClock);
    this.load.image(ASSET_KEYS.ICON_DISAPPOINTED_EMOJI, IconDisappointedEmoji);
    this.load.image(ASSET_KEYS.ICON_HERB, IconHerb);
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
      COLORS.WHITE.number,
    );
    this._drawRoundedRectangle(
      graphics,
      TEXTURE_KEYS.BUTTON_DISABLED,
      SIZES.BUTTON_WIDTH,
      SIZES.BUTTON_HEIGHT,
      6,
      COLORS.GRAY.number,
    );
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.TITLE);
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
      .lineStyle(2, COLORS.LIGHT_GRAY.number, 1)
      .fillStyle(fillColor, 1)
      .fillRoundedRect(0, 0, width, height, radius)
      .strokeRoundedRect(0, 0, width, height, radius);
    graphics.generateTexture(key, width, height);
  }
}
