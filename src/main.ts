import * as Phaser from "phaser";

import { GameCompleteScene } from "./scenes/game-complete-scene";
import { GameScene } from "./scenes/game-scene";
import { PreloadScene } from "./scenes/preload-scene";
import { TitleScene } from "./scenes/title-scene";
import "./style.css";

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  parent: "game-container",
  backgroundColor: "#fff",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloadScene, TitleScene, GameScene, GameCompleteScene],
};

export default new Phaser.Game(config);
