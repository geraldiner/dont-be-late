import { Link } from "./link";

const CREDITS_LINK =
  "https://github.com/geraldiner/dont-be-late/blob/main/CREDITS.md";

export class CreditsExternalLink extends Link {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "🔗 See full credits");
  }

  onClick(): void {
    window.open(CREDITS_LINK);
  }
}
