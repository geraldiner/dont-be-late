import { AUDIO_KEYS, SCENE_KEYS } from "../variables";

export default class AudioScene extends Phaser.Scene {
  private _bgm!: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: SCENE_KEYS.AUDIO });
  }

  create(): void {
    this._bgm = this.sound.add(AUDIO_KEYS.BACKGROUND, {
      loop: true,
      volume: 0.125,
    });
  }

  public setMute(shouldMute: boolean): void {
    this.sound.setMute(shouldMute);
  }

  public playBgm(): void {
    this._bgm.play();
  }

  public playSfx(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
    this.sound.play(key, config);
  }
}
