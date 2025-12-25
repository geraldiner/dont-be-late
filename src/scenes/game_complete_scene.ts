import * as Phaser from "phaser";

import { GameManager } from "../manager/game_manager";
import { CreditsLink } from "../ui/links/credits_link";
import { MainMenuLink } from "../ui/links/main_menu_link";
import { DefaultPage } from "../ui/pages/default_page";
import { Paragraph } from "../ui/paragraph";
import { SectionHeadingWithDivider } from "../ui/section_heading_divider";
import { ASSET_KEYS, PADDING, SCENE_KEYS } from "../variables";

export class GameCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAME_COMPLETE });
  }

  public create(): void {
    this.cameras.main.fadeIn(300, 207, 172, 140);
    this.tweens.add({
      targets: [this.cameras.main],
      duration: 777,
      y: { from: 600, to: 0 },
      ease: "Sine.easeInOut",
    });
    const breadcrumbs = [
      "Codedex.io 2025 Game Jam",
      "GeraldineDesu",
      "Don't Be Late!",
      "Congratulations!",
    ];
    const page = new DefaultPage(
      this,
      0,
      0,
      breadcrumbs,
      ASSET_KEYS.HEADER_ENDGAME,
      ASSET_KEYS.ICON_TROPHY,
      "Congratulations!",
      ASSET_KEYS.ACCENT_ENDGAME,
    );

    page.addChild(
      new SectionHeadingWithDivider(this, 0, 0, "You beat the game"),
    );

    page.addChild(new Paragraph(this, 0, 0, "Thank you for playing. :)"));

    page.addChild(new MainMenuLink(this, 0, 0), PADDING.FORTY);
    page.addChild(new CreditsLink(this, 0, 0));
    const gm = GameManager.getInstance();
    gm.resetGame();
  }
}
