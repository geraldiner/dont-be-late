import * as Phaser from "phaser";

import { GameCompleteScene } from "./scenes/game_complete_scene";
import { GameScene } from "./scenes/game_scene";
import { PreloadScene } from "./scenes/preload_scene";
import { TitleScene } from "./scenes/title_scene";
import "./style.css";
import { COLORS } from "./variables";

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  resolution: window.devicePixelRatio || 1,
  parent: "game-container",
  backgroundColor: COLORS.LIGHT_BROWN.hex,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloadScene, TitleScene, GameScene, GameCompleteScene],
};

export default new Phaser.Game(config);
