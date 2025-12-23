import { FONT_KEYS, SIZING } from "../variables";

export class TaskTile extends Phaser.GameObjects.Container {
  private _originX: number;
  private _originY: number;
  private _baseDepth: number = 200;
  private _startDragging: boolean = false;

  private _onDrag: Function | null = null;
  private _onDragEnd: Function | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y);
    scene.add.existing(this);
    this._originX = x;
    this._originY = y;

    const background = scene.add
      .rectangle(0, -1, 378, 40, 0xffffff)
      .setStrokeStyle(1, 0xe5e7eb)
      .setOrigin(0.5, 0);
    const label = scene.add
      .text(
        background.x - background.width / 2 + SIZING.PADDING * 2,
        background.height / 2,
        text,
        {
          fontFamily: FONT_KEYS.REGULAR,
          fontSize: "16px",
          color: "#111111",
        },
      )
      .setOrigin(0, 0.5);
    this.add([background, label]);
    this.setSize(background.width, background.height)
      .setInteractive({
        useHandCursor: true,
      })
      .setDepth(this._baseDepth);

    scene.input.setDraggable(this);

    this._registerDragEvents();
  }

  public _registerDragEvents(): void {
    this._onDrag = (
      pointer: Phaser.Input.Pointer,
      gameObject: any,
      dragX: number,
      dragY: number,
    ) => {
      if (gameObject === this) {
        this.x = dragX;
        this.y = dragY;
        this.setDepth(this._baseDepth + 1);
      }
    };

    this._onDragEnd = (pointer: Phaser.Input.Pointer, gameObject: any) => {
      if (gameObject === this) {
        this.x = this._originX;
        this.y = this._originY;
        this.setDepth(this._baseDepth);
      }
    };
    this.scene.input.on("drag", this._onDrag, this);
    this.scene.input.on("dragend", this._onDragEnd, this);
  }
}
