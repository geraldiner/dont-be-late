import { PADDING } from "../../variables";
import { Navbar } from "../navbar";

export abstract class Page extends Phaser.GameObjects.Container {
  public navbar: Navbar;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    breadcrumbs: Array<string>,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    const navbar = new Navbar(scene, 0, PADDING.TWENTY, breadcrumbs);
    this.navbar = navbar;

    this.add(navbar);
  }
}
