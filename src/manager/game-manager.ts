import { OutcomeScreen } from "../game-screens/outcome";
import { SCENE_KEYS } from "../variables";
import { DataManager } from "./data-manager";

export class GameManager {
  // Tiles
  private _availableTiles: string[] = [];
  public get availableTiles(): string[] {
    return this._availableTiles;
  }
  private _placedTiles: string[] = [];
  public get placedTiles(): string[] {
    return this._placedTiles;
  }

  private _panelAmount: number = 1;
  public get panelAmount(): number {
    return this._panelAmount;
  }

  private _panelLayout: Array<{
    x: number;
    y: number;
    texture: string;
  }> = [];
  public get panelLayout(): Array<{
    x: number;
    y: number;
    texture: string;
  }> {
    return this._panelLayout;
  }

  // Game states
  public chapter: number = 1;
  private _chapterTitle: string = "";
  public level: number = 1;
  private _levelTitle: string = "";
  public getTitle(): string {
    return `${this._chapterTitle} ${this.chapter}-${this.level}: ${this._levelTitle}`;
  }

  private _outcome: string = "You made it on time!";
  public get outcome(): string {
    return this._outcome;
  }

  private static instance: GameManager;
  private constructor() {}
  static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public setupLevel(): void {
    // Setup available tiles for the current chapter and level
    const dm = DataManager.getInstance();
    const chapterData = dm.getChapterData(this.chapter);
    const levelData = chapterData.levels[this.level - 1];
    this._availableTiles = levelData.availableTiles;
    this._panelAmount = levelData.panelAmount;
    this._chapterTitle = chapterData.title;
    this._levelTitle = levelData.title;
    this._panelLayout = dm.getPanelLayout(levelData.panelLayoutKey);
  }

  public updatePlacedTiles(
    addTileIndex: number,
    addedTileKey: string,
    removedTileKey?: string,
  ): void {
    this._placedTiles[addTileIndex] = addedTileKey;
    if (removedTileKey) {
      const index = this._placedTiles.indexOf(removedTileKey);
      if (index !== -1) {
        this._placedTiles.splice(index, 1);
      }
    }
    console.log(this._placedTiles);
  }

  public showOutcomeScreen(scene: Phaser.Scene): void {
    new OutcomeScreen(scene, 0, 0, this.outcome);
  }

  public setNextLevel(scene: Phaser.Scene): void {
    this.level += 1;
    if (this.level > 3) {
      this.chapter += 1;
      this.level = 1;
    }

    if (this.chapter > 2) {
      scene.scene.start(SCENE_KEYS.GAME_COMPLETE);
    } else {
      this.setupLevel();
    }
  }

  private _checkOutcome(): void {
    // Placeholder logic for determining outcome
  }

  public resetLevel(scene: Phaser.Scene): void {
    this._placedTiles = [];
    this.setupLevel();
    scene.scene.restart();
  }

  public goNextLevel(scene: Phaser.Scene): void {
    this.setNextLevel(scene);
    scene.scene.restart();
  }
}
