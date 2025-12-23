import * as Phaser from "phaser";

import VigaFont from "../assets/fonts/Viga-Regular.ttf";
import { FONT_KEYS, SCENE_KEYS, SIZING, TEXTURE_KEYS } from "../variables";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  public preload(): void {
    // Load fonts
    this.load.font(FONT_KEYS.REGULAR, VigaFont);

    // Generate button textures
    // Buttons
    const graphics = new Phaser.GameObjects.Graphics(this);
    this._drawRoundedRectangle(
      graphics,
      TEXTURE_KEYS.BUTTON,
      SIZING.BUTTON_WIDTH,
      SIZING.BUTTON_HEIGHT,
      6,
      0x11aaaa,
    );
    this._drawRoundedRectangle(
      graphics,
      TEXTURE_KEYS.BUTTON_DISABLED,
      SIZING.BUTTON_WIDTH,
      SIZING.BUTTON_HEIGHT,
      6,
      0xdddddd,
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
      .fillStyle(fillColor, 1)
      .fillRoundedRect(0, 0, width, height, radius);
    graphics.generateTexture(key, width, height);
  }
}
