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

  private _tileLayout: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }> = [];
  public get tileLayout(): Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }> {
    return this._tileLayout;
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
    this._tileLayout = dm.getTileLayout(levelData.tileLayoutKey);
  }

  public updatePlaceTiles(tileKey: string, removedTileKey?: string): void {
    // Update placed tiles logic
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
