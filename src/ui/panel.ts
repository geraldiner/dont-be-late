import { SIZING } from "../variables";

export class Panel extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, id?: string) {
    super(scene, x, y + SIZING.PADDING);
  }
}
