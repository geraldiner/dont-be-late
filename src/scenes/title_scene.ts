import * as Phaser from "phaser";

import { GameManager } from "../manager/game_manager";
import { ContinueLink } from "../ui/links/continue_link";
import { CreditsLink } from "../ui/links/credits_link";
import { StartLink } from "../ui/links/start_link";
import { DefaultPage } from "../ui/pages/default_page";
import { Paragraph } from "../ui/paragraph";
import { AUDIO_KEYS, IMAGE_KEYS, PADDING, SCENE_KEYS } from "../variables";
import type AudioScene from "./audio_scene";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  public create(): void {
    // DEBUG: Uncomment out to skip title scene
    // this.scene.start(SCENE_KEYS.PROLOGUE);
    // TODO: Needs user input before starting. Consider adding modal before this.
    // this.sound.play(AUDIO_KEYS.SCENE_TRANSITION);
    this.cameras.main.fadeIn(300, 207, 172, 140);
    this.tweens.add({
      targets: [this.cameras.main],
      duration: 777,
      y: { from: 600, to: 0 },
      ease: "Sine.easeInOut",
    });
    const audioScene = this.scene.get(SCENE_KEYS.AUDIO) as AudioScene;
    if (!audioScene.sound.get(AUDIO_KEYS.BACKGROUND)?.isPlaying) {
      audioScene.playBgm();
    }

    const gm = GameManager.getInstance();
    const hasSaveData = gm.loadSave();

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
      IMAGE_KEYS.HEADER_FOREST,
      IMAGE_KEYS.ICON_HERB,
      "Don't Be Late!",
      IMAGE_KEYS.ACCENT_FOREST,
    );

    page.addChild(
      new Paragraph(
        this,
        0,
        0,
        "A puzzle game about putting events in the correct order to make it on time.",
      ),
    );

    page.addChild(
      new Paragraph(
        this,
        0,
        0,
        "Due to browser settings, you may need to click anywhere first to enable audio.",
      ),
    );

    if (hasSaveData) {
      page.addChild(new ContinueLink(this, 0, 0), PADDING.FORTY);
    }

    page.addChild(
      new StartLink(this, 0, 0),
      hasSaveData ? PADDING.TWENTY : PADDING.FORTY,
    );
    page.addChild(new CreditsLink(this, 0, 0));
  }
}
