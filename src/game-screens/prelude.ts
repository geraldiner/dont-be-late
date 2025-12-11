export class PreludeScreen extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    chapter: number,
    level: number,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setDepth(1200);

    const [width, height] = [scene.game.canvas.width, scene.game.canvas.height];

    const bg = scene.add
      .rectangle(0, 0, width, height, 0x000000)
      .setOrigin(0.5);

    const text = scene.add
      .text(0, 0, `Chapter ${chapter}\nLevel ${level}`, {
        fontFamily: "Arial",
        fontSize: "48px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.add([bg, text]);
    this.setPosition(width / 2, height / 2);

    scene.time.delayedCall(2000, () => {
      this.destroy();
    });
  }
}
