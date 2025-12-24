import * as Phaser from "phaser";

import { StartLink } from "../ui/links/start_link";
import { DefaultPage } from "../ui/pages/default_page";
import { Paragraph } from "../ui/paragraph";
import { ASSET_KEYS, PADDING, SCENE_KEYS } from "../variables";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  public create(): void {
    // DEBUG: Uncomment out to skip title scene
    this.scene.start(SCENE_KEYS.GAME);

    const breadcrumbs = [
      "Codedex.io 2025 Game Jam",
      "GeraldineDesu",
      "Don't Be Late!",
    ];

    const page = new DefaultPage(
      this,
      0,
      0,
      breadcrumbs,
      ASSET_KEYS.HEADER_FOREST,
      ASSET_KEYS.ICON_HERB,
      "Don't Be Late!",
      ASSET_KEYS.ACCENT_FOREST,
    );

    page.addChild(
      new Paragraph(
        this,
        0,
        0,
        "A puzzle game about putting events in the correct order to make it on time.",
      ),
    );
    page.addChild(new StartLink(this, 0, 0), PADDING.FORTY);
  }
}
