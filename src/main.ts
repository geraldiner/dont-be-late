import * as Phaser from "phaser";

import { CreditsScene } from "./scenes/credits_scene";
import { GameCompleteScene } from "./scenes/game_complete_scene";
import { GameScene } from "./scenes/game_scene";
import { OutcomeScene } from "./scenes/outcome_scene";
import { PreloadScene } from "./scenes/preload_scene";
import { PrologueScene } from "./scenes/prologue_scene";
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
  scene: [
    PreloadScene,
    TitleScene,
    PrologueScene,
    GameScene,
    OutcomeScene,
    GameCompleteScene,
    CreditsScene,
  ],
};

export default new Phaser.Game(config);
