import * as Phaser from "phaser";

import { Header } from "../ui/header";
import { StartLink } from "../ui/links/start_link";
import { Navbar } from "../ui/navbar";
import { Page } from "../ui/page";
import { ASSET_KEYS, PADDING, SCENE_KEYS, SIZES } from "../variables";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  public create(): void {
    // DEBUG: Uncomment out to skip title scene
    // this.scene.start(SCENE_KEYS.GAME);

    const navbar = new Navbar(this, 0, PADDING.TWENTY, [
      "Codedex.io 2025 Game Jam",
      "GeraldineDesu",
      "Don't Be Late!",
    ]);

    const header = new Header(
      this,
      0,
      navbar.y + SIZES.NAVBAR_HEIGHT,
      ASSET_KEYS.HEADER_FOREST,
    );

    const page = new Page(
      this,
      0,
      header.y + SIZES.HEADER_HEIGHT,
      ASSET_KEYS.ICON_HERB,
      "Don't Be Late!",
      ASSET_KEYS.ACCENT_FOREST,
    );

    page.addChild(new StartLink(this, 0, 0));
  }
}
