import { FONT_KEYS, SIZING, TEXTURE_KEYS } from "../../variables";

export abstract class Button extends Phaser.GameObjects.Container {
  private _text: Phaser.GameObjects.Text;
  private _bg: Phaser.GameObjects.Image;
  public isDisabled: boolean = false;

  abstract onClick(): void;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y);
    scene.add.existing(this);

    this._bg = scene.add.image(0, 0, TEXTURE_KEYS.BUTTON).setOrigin(0.5);

    this._text = scene.add
      .text(0, 0, text, {
        fontSize: "14px",
        color: "#000000",
        align: "center",
        fontFamily: FONT_KEYS.REGULAR,
      })
      .setOrigin(0.5);

    this.add([this._bg, this._text]);

    this.setSize(
      SIZING.BUTTON_WIDTH + SIZING.PADDING,
      SIZING.BUTTON_HEIGHT + SIZING.PADDING,
    );

    this.setInteractive({ useHandCursor: true });

    this.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (!this.isDisabled) {
        this.onClick();
      }
    });

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.removeAllListeners();
    });
  }

  public setDisabled(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this._bg.setTexture(
      isDisabled ? TEXTURE_KEYS.BUTTON_DISABLED : TEXTURE_KEYS.BUTTON,
    );
  }

  public setText(text: string): void {
    this._text.setText(text);
  }
}
