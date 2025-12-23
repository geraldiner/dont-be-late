import { FONT_KEYS, PADDING } from "../variables";

const TILE_WIDTH = 378;
const TILE_HEIGHT = 40;
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
      .rectangle(0, -1, 378, 40, bgColor)
      .setStrokeStyle(1, 0xe5e7eb)
      .setOrigin(0.5, 0);
    const label = scene.add
      .text(bg.x - bg.width / 2 + PADDING.TWENTY, bg.height / 2, text, {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: "16px",
        color: "#111111",
      })
      .setOrigin(0, 0.5);
    this.add([bg, label]);
    this.setSize(TILE_WIDTH, TILE_HEIGHT).setDepth(TILE_DEPTH);

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
