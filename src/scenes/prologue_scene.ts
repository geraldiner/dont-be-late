import { DataManager } from "../manager/data_manager";
import { GameManager } from "../manager/game_manager";
import { ContinueButton } from "../ui/buttons/continue_button";
import { DefaultPage } from "../ui/pages/default_page";
import { Paragraph } from "../ui/paragraph";
import { SectionHeadingWithDivider } from "../ui/section_heading_divider";
import { AUDIO_KEYS, PADDING, SCENE_KEYS, SIZES } from "../variables";
import type { CHAPTERS, ChapterTheme } from "../variables/themes";

export class PrologueScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PROLOGUE });
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

    const dm = DataManager.getInstance();
    const gm = GameManager.getInstance();

    const chapterData = dm.getChapterData(gm.chapter);
    const { headerImageKey, pageIconKey, accentImageKey } = dm.getChapterTheme(
      gm.chapterId as (typeof CHAPTERS)[keyof typeof CHAPTERS],
    ) as ChapterTheme;
    const levelData = chapterData.levels[gm.level - 1];

    const breadcrumbs = ["Don't Be Late!", gm.chapterTitle, gm.levelTitle];

    const page = new DefaultPage(
      this,
      0,
      0,
      breadcrumbs,
      headerImageKey,
      pageIconKey,
      `Don't Be Late for ${gm.chapterTitle}`,
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

    levelData.hints.forEach((line: string, index: number) => {
      page.addChild(
        new Paragraph(this, 0, 0, line),
        index === 0 ? PADDING.TWENTY : undefined,
      );
    });

    page.addChild(
      new ContinueButton(
        this,
        0,
        SIZES.PAGE_DEFAULT_HEIGHT - SIZES.BUTTON_HEIGHT,
      ),
      PADDING.FORTY,
    );
  }
}
