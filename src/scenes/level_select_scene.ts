import { DataManager } from "../manager/data_manager";
import { GameManager } from "../manager/game_manager";
import { GoToLevelLink } from "../ui/links/go_to_level_link";
import { DefaultPage } from "../ui/pages/default_page";
import { Paragraph } from "../ui/paragraph";
import { IMAGE_KEYS, PADDING, SCENE_KEYS } from "../variables";

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.LEVEL_SELECT });
  }

  public create(): void {
    this.cameras.main.fadeIn(300, 207, 172, 140);
    this.tweens.add({
      targets: [this.cameras.main],
      duration: 777,
      y: { from: 600, to: 0 },
      ease: "Sine.easeInOut",
    });

    const breadcrumbs = ["Don't Be Late!", "Continue"];

    const page = new DefaultPage(
      this,
      0,
      0,
      breadcrumbs,
      IMAGE_KEYS.HEADER_FOREST,
      IMAGE_KEYS.ICON_HERB,
      "Continue",
      IMAGE_KEYS.ACCENT_FOREST,
    );

    const dm = DataManager.getInstance();
    const gameData = dm.getAllChapterData();
    const gm = GameManager.getInstance();
    const highestLevelReached = gm.highestLevelReached;
    const [highestChapter, highestLevel] = highestLevelReached
      .split("-")
      .map((numStr) => parseInt(numStr, 10));

    // Filter levels that are unlocked
    for (let i = 0; i <= highestChapter - 1; i++) {
      const chapter = gameData[i];
      const chapterNum = i + 1;
      // Add chapter title to page
      page.addChild(
        new Paragraph(this, 0, 0, `${chapterNum}. ${chapter.title}`),
      );
      for (let j = 0; j < chapter.levels.length; j++) {
        const level = chapter.levels[j];
        const levelNum = j + 1;
        const padding = j === 0 ? PADDING.TWENTY : PADDING.TEN;
        // Add level link to chapter section
        // Add a checkmark for passed levels
        if (gm.levelsCompleted.has(`${chapterNum}-${levelNum}`)) {
          page.addChild(
            new GoToLevelLink(
              this,
              0,
              0,
              chapterNum,
              levelNum,
              `✓ ${level.title}`,
            ),
            padding,
          );
        } else if (
          chapterNum === highestChapter &&
          levelNum === highestLevel + 1
        ) {
          page.addChild(
            new GoToLevelLink(
              this,
              0,
              0,
              chapterNum,
              levelNum,
              `○ ${level.title}`,
            ),
            padding,
          );
        }
      }
    }
  }
}
