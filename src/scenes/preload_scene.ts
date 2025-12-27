import AudioBackground from "../assets/audio/background.mp3";
import AudioDragEnd from "../assets/audio/drag_end.mp3";
import AudioDragStart from "../assets/audio/drag_start.mp3";
import AudioEndgame from "../assets/audio/endgame.mp3";
import AudioFail from "../assets/audio/fail.mp3";
import AudioMouseClick from "../assets/audio/mouse_click.mp3";
import AudioSceneTransition from "../assets/audio/scene_transition.mp3";
import AudioSuccess from "../assets/audio/success.mp3";
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
  AUDIO_KEYS,
  COLORS,
  FONT_KEYS,
  IMAGE_KEYS,
  SCENE_KEYS,
  SIZES,
  TEXTURE_KEYS,
} from "../variables";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  public preload(): void {
    // Load audio
    this.load.audio(AUDIO_KEYS.BACKGROUND, AudioBackground);
    this.load.audio(AUDIO_KEYS.ENDGAME, AudioEndgame);
    this.load.audio(AUDIO_KEYS.DRAG_END, AudioDragEnd);
    this.load.audio(AUDIO_KEYS.DRAG_START, AudioDragStart);
    this.load.audio(AUDIO_KEYS.FAIL, AudioFail);
    this.load.audio(AUDIO_KEYS.MOUSE_CLICK, AudioMouseClick);
    this.load.audio(AUDIO_KEYS.SCENE_TRANSITION, AudioSceneTransition);
    this.load.audio(AUDIO_KEYS.SUCCESS, AudioSuccess);

    // Load font
    this.load.font(FONT_KEYS.SERIF, NotoSerifFont);

    // Load images
    this.load.image(IMAGE_KEYS.ACCENT_FOREST, AccentForest);
    this.load.image(IMAGE_KEYS.ACCENT_ENDGAME, AccentEndgame);
    this.load.image(IMAGE_KEYS.ACCENT_SCHOOL, AccentSchool);
    this.load.image(IMAGE_KEYS.HEADER_ENDGAME, HeaderEndgame);
    this.load.image(IMAGE_KEYS.HEADER_FOREST, HeaderForest);
    this.load.image(IMAGE_KEYS.HEADER_SCHOOL, HeaderSchool);
    this.load.image(IMAGE_KEYS.ICON_CLOCK, IconClock);
    this.load.image(IMAGE_KEYS.ICON_DISAPPOINTED_EMOJI, IconDisappointedEmoji);
    this.load.image(IMAGE_KEYS.ICON_HERB, IconHerb);
    this.load.image(IMAGE_KEYS.ICON_LIST, IconList);
    this.load.image(IMAGE_KEYS.ICON_MEDAL_FIRST, IconMedalFirst);
    this.load.image(IMAGE_KEYS.ICON_SIX_DOTS, IconSixDots);
    this.load.image(IMAGE_KEYS.ICON_STAR, IconStar);
    this.load.image(IMAGE_KEYS.ICON_THREE_DOTS, IconThreeDots);
    this.load.image(IMAGE_KEYS.ICON_TRIANGULAR_RULER, IconTriangularRuler);
    this.load.image(IMAGE_KEYS.ICON_TROPHY, IconTrophy);

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
    this.scene.launch(SCENE_KEYS.AUDIO).sendToBack();
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
