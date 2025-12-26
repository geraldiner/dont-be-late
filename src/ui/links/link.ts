import type AudioScene from "../../scenes/audio_scene";
import {
  AUDIO_KEYS,
  COLORS,
  FONT_KEYS,
  FONT_SIZES,
  SCENE_KEYS,
} from "../../variables";

export abstract class Link extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y);
    scene.add.existing(this);

    const link = scene.add
      .text(0, 0, text, {
        fontFamily: FONT_KEYS.SERIF,
        fontSize: FONT_SIZES.DEFAULT,
        color: COLORS.BLACK.hex,
      })
      .setOrigin(0.5);
    this.add([link]);
    this.setSize(link.width, link.height);
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

  playSound(): void {
    const audioScene = this.scene.scene.get(SCENE_KEYS.AUDIO) as AudioScene;
    audioScene.playSfx(AUDIO_KEYS.MOUSE_CLICK);
  }
}
