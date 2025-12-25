import { DataManager } from "../manager/data_manager";
import { GameManager } from "../manager/game_manager";
import { NextButton, ResetButton } from "../ui/buttons";
import { DefaultPage } from "../ui/pages/default_page";
import { Paragraph } from "../ui/paragraph";
import { SectionHeadingWithDivider } from "../ui/section_heading_divider";
import { ASSET_KEYS, OUTCOMES, PADDING, SCENE_KEYS } from "../variables";
import type { CHAPTERS, ChapterTheme } from "../variables/themes";

export class OutcomeScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.OUTCOME });
  }

  public create(): void {
    this.cameras.main.fadeIn(300, 207, 172, 140);
    this.tweens.add({
      targets: [this.cameras.main],
      duration: 777,
      y: { from: 600, to: 0 },
      ease: "Power2",
    });
    const dm = DataManager.getInstance();
    const gm = GameManager.getInstance();

    const { headerImageKey, accentImageKey } = dm.getChapterTheme(
      gm.chapterId as (typeof CHAPTERS)[keyof typeof CHAPTERS],
    ) as ChapterTheme;
    const succeeded = gm.outcome !== OUTCOMES.FAIL;

    const breadcrumbs = ["Don't Be Late!", gm.chapterTitle, gm.levelTitle];
    const titleText = succeeded ? "Success!" : "Oh no!";
    const pageIcon = succeeded
      ? ASSET_KEYS.ICON_MEDAL_FIRST
      : ASSET_KEYS.ICON_DISAPPOINTED_EMOJI;

    const page = new DefaultPage(
      this,
      0,
      0,
      breadcrumbs,
      headerImageKey,
      pageIcon,
      titleText,
      accentImageKey,
    );

    page.addChild(
      new SectionHeadingWithDivider(
        this,
        0,
        0,
        `${gm.chapter}-${gm.level}: ${gm.levelTitle}`,
      ),
    );

    const outcomeText = succeeded
      ? "Congratulations! You completed the level."
      : "Sorry! Please try again.";

    page.addChild(new Paragraph(this, 0, 0, outcomeText));
    if (succeeded) {
      page.addChild(new NextButton(this, 0, 0), PADDING.FORTY);
    }

    const resetText = succeeded ? "Replay" : "Try Again";

    page.addChild(
      new ResetButton(this, 0, 0, resetText),
      succeeded ? PADDING.TEN : PADDING.FORTY,
    );
  }
}
