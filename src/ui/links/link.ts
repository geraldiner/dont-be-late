import { COLORS, FONT_KEYS, FONT_SIZES } from "../../variables";

export abstract class Link extends Phaser.GameObjects.Container {
  private _text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y);
    scene.add.existing(this);

    this._text = scene.add
      .text(0, 0, text, {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: FONT_SIZES.DEFAULT,
        color: COLORS.BLACK.hex,
      })
      .setOrigin(0.5);
    this.add([this._text]);
    this.setSize(this._text.width, this._text.height);
    this.setPosition(this.x + this.width / 2, this.y + this.height / 2);
    this.setInteractive({ useHandCursor: true });

    this.on(Phaser.Input.Events.POINTER_UP, () => {
      this.onClick();
    });

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.removeAllListeners();
    });
  }

  abstract onClick(): void;
}
