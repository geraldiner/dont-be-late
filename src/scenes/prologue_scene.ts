import { DataManager } from "../manager/data_manager";
import { GameManager } from "../manager/game_manager";
import { DefaultPage } from "../ui/pages/default_page";
import { Paragraph } from "../ui/paragraph";
import { SectionHeading } from "../ui/section_heading";
import { ASSET_KEYS, PADDING, SCENE_KEYS, SIZES } from "../variables";

export class PrologueScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PROLOGUE });
  }

  public create(): void {
    const dm = DataManager.getInstance();
    const gm = GameManager.getInstance();

    const chapterData = dm.getChapterData(gm.chapter);
    const levelData = chapterData.levels[gm.level - 1];

    const breadcrumbs = ["Don't Be Late!", gm.chapterTitle, gm.levelTitle];

    const page = new DefaultPage(
      this,
      0,
      0,
      breadcrumbs,
      ASSET_KEYS.HEADER_SCHOOL,
      ASSET_KEYS.ICON_TRIANGULAR_RULER,
      "Don't Be Late for...",
      ASSET_KEYS.ACCENT_SCHOOL,
    );

    page.addChild(
      new SectionHeading(
        this,
        0,
        0,
        `${gm.chapterTitle} ${gm.chapter}-${gm.level}: ${gm.levelTitle}`,
      ),
    );

    levelData.sceneStartText.forEach((line: string, index: number) => {
      page.addChild(
        new Paragraph(this, 0, 0, line),
        index === 0 ? PADDING.TWENTY : undefined,
      );
    });

    this.tweens.add({
      targets: [page],
      x: -SIZES.PAGE_WIDTH * 2,
      duration: 1000,
      ease: "EaseInOut",
      delay: 2700,
      onComplete: () => {
        this.scene.start(SCENE_KEYS.GAME);
      },
    });
  }
}
