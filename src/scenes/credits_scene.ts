import * as Phaser from "phaser";

import { MainMenuLink } from "../ui/links/main_menu_link";
import { DefaultPage } from "../ui/pages/default_page";
import { Paragraph } from "../ui/paragraph";
import { ASSET_KEYS, PADDING, SCENE_KEYS } from "../variables";

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.CREDITS });
  }

  public create(): void {
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
      "Credits",
      ASSET_KEYS.ACCENT_FOREST,
    );

    page.addChild(
      new Paragraph(
        this,
        0,
        0,
        "All credits to the respective authors of the assets used in this game.",
      ),
    );
    page.addChild(new MainMenuLink(this, 0, 0), PADDING.FORTY);
  }
}
