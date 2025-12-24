import {
  ASSET_KEYS,
  COLORS,
  FONT_KEYS,
  FONT_SIZES,
  PADDING,
  SIZES,
} from "../variables";

const TILE_DEPTH = 200;

export class TaskTile extends Phaser.GameObjects.Container {
  private _key: string = "";
  public get key(): string {
    return this._key;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    key: string,
    isFixed: boolean = false,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this._key = key;

    const bgColor = isFixed ? 0xf3f4f6 : 0xffffff;

    const bg = scene.add
      .rectangle(0, -1, SIZES.TILE_WIDTH, SIZES.TILE_HEIGHT, bgColor)
      .setStrokeStyle(1, 0xe5e7eb);

    let sixDotsIcon: Phaser.GameObjects.Image | undefined = undefined;
    if (!isFixed) {
      sixDotsIcon = scene.add
        .image(
          bg.x - bg.width / 2 + PADDING.TEN,
          bg.y,
          ASSET_KEYS.ICON_SIX_DOTS,
        )
        .setOrigin(0, 0.5);
    }

    const labelX = sixDotsIcon
      ? sixDotsIcon.x + SIZES.ICON + PADDING.TEN
      : bg.x - bg.width / 2 + PADDING.TWENTY;
    const label = scene.add
      .text(labelX, bg.y, text, {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: FONT_SIZES.DEFAULT,
        color: COLORS.BLACK.hex,
      })
      .setOrigin(0, 0.5);
    this.add([bg, label]);
    if (sixDotsIcon) {
      this.add(sixDotsIcon);
    }
    this.setSize(SIZES.TILE_WIDTH, SIZES.TILE_HEIGHT).setDepth(TILE_DEPTH);

    if (isFixed) {
      this.disableInteractive();
    } else {
      this.setInteractive({ useHandCursor: true });
      scene.input.setDraggable(this);
    }

    this.on("dragstart", () => {
      if (!isFixed) {
        this.setDepth(TILE_DEPTH + 1);
        this.emit("tile-drag-start", this);
      }
    });

    this.on(
      "drag",
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        if (!isFixed) {
          this.y = dragY;
          this.setDepth(TILE_DEPTH + 1);
          this.emit("tile-drag-move", this);
        }
      },
    );

    this.on("dragend", () => {
      if (!isFixed) {
        this.setDepth(TILE_DEPTH);
        this.emit("tile-drag-end", this);
      }
    });
  }

  public snapTo(y: number): void {
    this.scene.tweens.add({
      targets: this,
      y,
      duration: 150,
      ease: "Cubic.Out",
    });
  }
}
