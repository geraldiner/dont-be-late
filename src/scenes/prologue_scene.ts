import { DataManager } from "../manager/data_manager";
import { GameManager } from "../manager/game_manager";
import { Header } from "../ui/header";
import { Navbar } from "../ui/navbar";
import { Page } from "../ui/page";
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

    const navbar = new Navbar(this, 0, PADDING.TWENTY, [
      "Don't Be Late!",
      chapterData.title,
      levelData.title,
    ]);

    const header = new Header(
      this,
      0,
      navbar.y + SIZES.NAVBAR_HEIGHT,
      ASSET_KEYS.HEADER_SCHOOL,
    );

    const page = new Page(
      this,
      0,
      header.y + SIZES.HEADER_HEIGHT,
      ASSET_KEYS.ICON_TRIANGULAR_RULER,
      "Don't Be Late for...",
      ASSET_KEYS.ACCENT_SCHOOL,
    );

    page.addChild(
      new SectionHeading(
        this,
        0,
        0,
        `${chapterData.title} ${gm.chapter}-${gm.level}: ${levelData.title}`,
      ),
    );

    levelData.sceneStartText.forEach((line: string, index: number) => {
      page.addChild(
        new Paragraph(this, 0, 0, line),
        index === 0 ? PADDING.TWENTY : undefined,
      );
    });

    this.tweens.add({
      targets: [navbar, header, page],
      x: -SIZES.PAGE_WIDTH * 2,
      duration: 1000,
      ease: "EaseInOut",
      delay: 3000,
      onComplete: () => {
        this.scene.start(SCENE_KEYS.GAME);
      },
    });
  }
}
