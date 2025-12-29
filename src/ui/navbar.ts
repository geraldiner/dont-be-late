import {
  COLORS,
  FONT_KEYS,
  FONT_SIZES,
  IMAGE_KEYS,
  PADDING,
  SIZES,
} from "../variables";
import { HoverTooltip } from "./hover_tooltip";
import { CreditsLink } from "./links/credits_link";
import { LevelSelectLink } from "./links/level_select_link";
import { MainMenuLink } from "./links/main_menu_link";

export class Navbar extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    crumbs: Array<string>,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = scene.add.rectangle(
      scene.game.canvas.width / 2,
      y,
      SIZES.PAGE_WIDTH,
      SIZES.NAVBAR_HEIGHT,
      COLORS.WHITE.number,
    );

    const menuIcon = scene.add
      .image(
        bg.x - bg.width / 2 + PADDING.TEN + SIZES.ICON / 2,
        bg.y,
        IMAGE_KEYS.ICON_LIST,
      )
      .setDisplaySize(SIZES.ICON, SIZES.ICON);

    menuIcon.setInteractive({ useHandCursor: true });
    menuIcon.on("pointerup", () => {
      this._showMenuModal();
    });

    const breadcrumbText = scene.add
      .text(
        menuIcon.x + menuIcon.displayWidth + PADDING.TEN,
        bg.y,
        crumbs.join(" / "),
        {
          fontFamily: FONT_KEYS.SERIF,
          fontSize: FONT_SIZES.DEFAULT,
          color: COLORS.BLACK.hex,
        },
      )
      .setOrigin(0, 0.5);

    const iconsContainer = scene.add.container(
      bg.width + PADDING.THIRTY,
      bg.height / 2,
      [],
    );

    const clockIcon = scene.add
      .image(0, 0, IMAGE_KEYS.ICON_CLOCK)
      .setDisplaySize(SIZES.ICON, SIZES.ICON)
      .setInteractive({ useHandCursor: true });

    const clockIconTooltip = new HoverTooltip(
      scene,
      clockIcon.x,
      clockIcon.y - SIZES.ICON,
      "Hey! Time is ticking!",
    );
    clockIcon.on("pointerover", () => {
      clockIconTooltip.show();
    });

    clockIcon.on("pointerout", () => {
      clockIconTooltip.hide();
    });

    const starIcon = scene.add
      .image(
        clockIcon.x + clockIcon.displayWidth + PADDING.TEN,
        0,
        IMAGE_KEYS.ICON_STAR,
      )
      .setDisplaySize(SIZES.ICON, SIZES.ICON)
      .setInteractive({ useHandCursor: true });

    const starIconTooltip = new HoverTooltip(
      scene,
      starIcon.x,
      starIcon.y - SIZES.ICON,
      "⭐Thanks for playing!⭐",
    );
    starIcon.on("pointerover", () => {
      starIconTooltip.show();
    });

    starIcon.on("pointerout", () => {
      starIconTooltip.hide();
    });

    const threeDotsIcon = scene.add
      .image(
        starIcon.x + starIcon.displayWidth + PADDING.TEN,
        0,
        IMAGE_KEYS.ICON_THREE_DOTS,
      )
      .setDisplaySize(SIZES.ICON, SIZES.ICON)
      .setInteractive({ useHandCursor: true });

    const threeDotsIconTooltip = new HoverTooltip(
      scene,
      threeDotsIcon.x,
      threeDotsIcon.y - SIZES.ICON,
      "Nothing to see here!",
    );
    threeDotsIcon.on("pointerover", () => {
      threeDotsIconTooltip.show();
    });

    threeDotsIcon.on("pointerout", () => {
      threeDotsIconTooltip.hide();
    });

    iconsContainer.add([
      clockIcon,
      starIcon,
      threeDotsIcon,
      clockIconTooltip,
      starIconTooltip,
      threeDotsIconTooltip,
    ]);

    this.add([bg, menuIcon, breadcrumbText, iconsContainer]);
    this.setSize(bg.width, bg.height);
  }

  private _showMenuModal(): void {
    this.scene.cameras.main.fadeIn(180, 207, 172, 140);
    const overlay = this.scene.add
      .rectangle(
        this.scene.game.canvas.width / 2,
        this.scene.game.canvas.height / 2,
        this.scene.game.canvas.width,
        this.scene.game.canvas.height,
        COLORS.LIGHT_BROWN.number,
      )
      .setDepth(999);

    const modal = this.scene.add.container(
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2,
      [],
    );

    const modalBg = this.scene.add
      .rectangle(
        0,
        0,
        SIZES.PAGE_WIDTH - PADDING.ONE_TWENTY * 2,
        SIZES.PAGE_WIDTH - PADDING.ONE_TWENTY * 4,
        COLORS.WHITE.number,
      )
      .setOrigin(0.5);
    modal.setSize(modalBg.width, modalBg.height).setDepth(1000);

    const menuLink = new MainMenuLink(this.scene, modalBg.x, -PADDING.FORTY);
    const levelSelectLink = new LevelSelectLink(
      this.scene,
      modalBg.x,
      PADDING.TWENTY,
    );
    const creditsLink = new CreditsLink(
      this.scene,
      modalBg.x,
      levelSelectLink.y + levelSelectLink.height + PADDING.TWENTY,
    );
    menuLink.setPosition(modalBg.x, -PADDING.FORTY);
    levelSelectLink.setPosition(
      modalBg.x,
      menuLink.y + menuLink.height + PADDING.TWENTY,
    );
    creditsLink.setPosition(
      modalBg.x,
      levelSelectLink.y + levelSelectLink.height + PADDING.TWENTY,
    );

    const closeLink = this.scene.add
      .text(
        modalBg.x,
        creditsLink.y + creditsLink.height + PADDING.FORTY,
        "Close",
        {
          fontFamily: FONT_KEYS.SERIF,
          fontSize: FONT_SIZES.DEFAULT,
          color: COLORS.BLACK.hex,
        },
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.tweens.add({
          targets: [modal, overlay],
          alpha: { from: 1, to: 0 },
          duration: 180,
          ease: "Sine.easeInOut",
          onComplete: () => {
            modal.destroy();
            overlay.destroy();
          },
        });
      });

    modal.add([modalBg, menuLink, levelSelectLink, creditsLink, closeLink]);
  }
}
