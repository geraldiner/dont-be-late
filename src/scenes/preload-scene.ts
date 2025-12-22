import * as Phaser from "phaser";

import VigaFont from "../assets/fonts/Viga-Regular.ttf";
import chapter1Prelude from "../assets/images/chapter-dividers/1-1.jpg";
import alarm from "../assets/images/tiles/alarm.png";
import backpack from "../assets/images/tiles/backpack.png";
import bell from "../assets/images/tiles/bell.png";
import board from "../assets/images/tiles/board.png";
import charge from "../assets/images/tiles/charge.png";
import coffee from "../assets/images/tiles/coffee.png";
import email from "../assets/images/tiles/email.png";
import folders from "../assets/images/tiles/folders.png";
import food from "../assets/images/tiles/food.png";
import group from "../assets/images/tiles/group.png";
import hoodie from "../assets/images/tiles/hoodie.png";
import kid from "../assets/images/tiles/kid.png";
import lego from "../assets/images/tiles/lego.png";
import lunchbox from "../assets/images/tiles/lunchbox.png";
import openDoor from "../assets/images/tiles/open_door.png";
import scroll from "../assets/images/tiles/scroll.png";
import toilet from "../assets/images/tiles/toilet.png";
import train from "../assets/images/tiles/train.png";
import van from "../assets/images/tiles/van.png";
import { DataManager } from "../manager/data-manager";
import {
  ASSET_KEYS,
  FONT_KEYS,
  SCENE_KEYS,
  SIZING,
  TEXTURE_KEYS,
} from "../variables";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  public preload(): void {
    // Load fonts
    this.load.font(FONT_KEYS.REGULAR, VigaFont);

    // Tiles
    this.load.image(ASSET_KEYS.ALARM, alarm);
    this.load.image(ASSET_KEYS.BACKPACK, backpack);
    this.load.image(ASSET_KEYS.BELL, bell);
    this.load.image(ASSET_KEYS.BOARD, board);
    this.load.image(ASSET_KEYS.CHARGE, charge);
    this.load.image(ASSET_KEYS.COFFEE, coffee);
    this.load.image(ASSET_KEYS.EMAIL, email);
    this.load.image(ASSET_KEYS.FOLDERS, folders);
    this.load.image(ASSET_KEYS.FOOD, food);
    this.load.image(ASSET_KEYS.GROUP, group);
    this.load.image(ASSET_KEYS.HOODIE, hoodie);
    this.load.image(ASSET_KEYS.KID, kid);
    this.load.image(ASSET_KEYS.LEGO, lego);
    this.load.image(ASSET_KEYS.LUNCHBOX, lunchbox);
    this.load.image(ASSET_KEYS.OPEN_DOOR, openDoor);
    this.load.image(ASSET_KEYS.SCROLL, scroll);
    this.load.image(ASSET_KEYS.TOILET, toilet);
    this.load.image(ASSET_KEYS.TRAIN, train);
    this.load.image(ASSET_KEYS.VAN, van);

    // Chapter 1 Assets
    this.load.image(ASSET_KEYS.CHAPTER_1_PRELUDE, chapter1Prelude);

    const dm = DataManager.getInstance();

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
    // Panel slots
    this._drawShape(
      graphics,
      TEXTURE_KEYS.SQUARE,
      dm.getPanelSlotSizes(TEXTURE_KEYS.SQUARE)!.width,
      dm.getPanelSlotSizes(TEXTURE_KEYS.SQUARE)!.height,
      0xffffff,
    );
    this._drawShape(
      graphics,
      TEXTURE_KEYS.TWO_THIRDS_RECTANGLE,
      dm.getPanelSlotSizes(TEXTURE_KEYS.TWO_THIRDS_RECTANGLE)!.width,
      dm.getPanelSlotSizes(TEXTURE_KEYS.TWO_THIRDS_RECTANGLE)!.height,
      0xffffff,
    );
    this._drawShape(
      graphics,
      TEXTURE_KEYS.HALF_RECTANGLE,
      dm.getPanelSlotSizes(TEXTURE_KEYS.HALF_RECTANGLE)!.width,
      dm.getPanelSlotSizes(TEXTURE_KEYS.HALF_RECTANGLE)!.height,
      0xffffff,
    );
    this._drawShape(
      graphics,
      TEXTURE_KEYS.FULL_RECTANGLE,
      dm.getPanelSlotSizes(TEXTURE_KEYS.FULL_RECTANGLE)!.width,
      dm.getPanelSlotSizes(TEXTURE_KEYS.FULL_RECTANGLE)!.height,
      0xffffff,
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
      .fillStyle(fillColor, 1)
      .fillRoundedRect(0, 0, width, height, radius);
    graphics.generateTexture(key, width, height);
  }

  private _drawShape(
    graphics: Phaser.GameObjects.Graphics,
    key: string,
    width: number,
    height: number,
    fillColor: number,
  ) {
    graphics.clear();
    graphics.lineStyle(2, 0x000000, 1);
    graphics
      .fillStyle(fillColor, 1)
      .fillRect(0, 0, width, height)
      .strokeRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
  }
}
