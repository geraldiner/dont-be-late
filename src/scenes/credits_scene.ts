import * as Phaser from "phaser";

import { CreditsExternalLink } from "../ui/links/credits_external_link";
import { MainMenuLink } from "../ui/links/main_menu_link";
import { DefaultPage } from "../ui/pages/default_page";
import { AUDIO_KEYS, IMAGE_KEYS, PADDING, SCENE_KEYS } from "../variables";

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.CREDITS });
  }

  public create(): void {
    this.sound.play(AUDIO_KEYS.SCENE_TRANSITION);
    this.cameras.main.fadeIn(300, 207, 172, 140);
    this.tweens.add({
      targets: [this.cameras.main],
      duration: 777,
      y: { from: 600, to: 0 },
      ease: "Sine.easeInOut",
    });
    const breadcrumbs = ["Don't Be Late!", "Credits"];

    const page = new DefaultPage(
      this,
      0,
      0,
      breadcrumbs,
      IMAGE_KEYS.HEADER_FOREST,
      IMAGE_KEYS.ICON_HERB,
      "Credits",
      IMAGE_KEYS.ACCENT_FOREST,
    );

    page.addChild(new CreditsExternalLink(this, 0, 0));

    page.addChild(new MainMenuLink(this, 0, 0), PADDING.FORTY);
  }
}
