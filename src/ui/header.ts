export class Header extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, imageKey: string) {
    super(scene, x, y);
    scene.add.existing(this);

    const headerImage = scene.add.image(
      scene.game.canvas.width / 2,
      y,
      imageKey,
    );
    this.add(headerImage);
  }
}
