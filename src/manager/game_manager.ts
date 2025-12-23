import { OutcomeScreen } from "../game_screens/outcome_screen";
import { effectHandlers } from "../utils";
import { OUTCOMES, SCENE_KEYS } from "../variables";
import { DataManager } from "./data_manager";

export interface Tile {
  key: string;
  label: string;
  duration: number;
  fixedPositionIndex?: number;
  penalties?: Array<{ type: string; extraMinutes: number }>;
  bonuses?: Array<{ type: string; reducedMinutes: number }>;
}

export class GameManager {
  // Tiles
  private _availableTiles: Tile[] = [];
  public get availableTiles(): Tile[] {
    return this._availableTiles;
  }
  private _currentSequence: string[] = [];
  public get currentSequence(): string[] {
    return this._currentSequence;
  }

  // Game states
  public chapter: number = 1;
  private _chapterTitle: string = "";
  public level: number = 1;
  private _levelTitle: string = "";
  public getTitle(): string {
    return `${this._chapterTitle} ${this.chapter}-${this.level}: ${this._levelTitle}`;
  }

  // Game conditions
  private _startTime: Date = new Date();
  public get startTime(): Date {
    return this._startTime;
  }
  private _currentTime: Date = new Date();
  public get currentTime(): Date {
    return this._currentTime;
  }
  private _targetTime: Date = new Date();
  public get targetTime(): Date {
    return this._targetTime;
  }
  private _idealEndTime: Date = new Date();
  private _outcome: string = "You made it on time!";
  public get outcome(): string {
    return this._outcome;
  }

  private _constraints: Array<{
    type: string;
    tileKey?: string;
    position?: number;
    second?: string;
  }> = [];

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
    // Level info
    this._chapterTitle = chapterData.title;
    this._levelTitle = levelData.title;
    // Tiles
    this._availableTiles = levelData.availableTiles;

    // Game conditions
    this._startTime = new Date(
      `${new Date().toDateString()} ${levelData.startTime}`,
    );
    this._currentTime = this._startTime;
    this._targetTime = new Date(
      `${this._currentTime.toDateString()} ${levelData.targetTime}`,
    );
    // Level rules
    this._idealEndTime = new Date(
      `${new Date().toDateString()} ${levelData.idealEndTime}`,
    );
    this._constraints = levelData.constraints;
  }

  public getFixedTiles(): Array<Tile> {
    return this._availableTiles.filter((tile) =>
      Object.prototype.hasOwnProperty.call(tile, "fixedPositionIndex"),
    );
  }

  public getFreeTiles(): Array<Tile> {
    return this._availableTiles.filter(
      (tile) =>
        !Object.prototype.hasOwnProperty.call(tile, "fixedPositionIndex"),
    );
  }

  public updateSequence(tiles: Array<string>): void {
    this._currentSequence = tiles;
    this.updateTimes();
    console.log("Updated sequence:", this._currentSequence);
  }

  // Update the current time based on placed tiles
  public updateTimes(): void {
    let accruedMinutes = 0; // time in minutes
    // Add base duration from placed tiles
    for (let i = 0; i < this._currentSequence.length; i++) {
      const tileKey = this._currentSequence[i];
      const tile = this._availableTiles.find((t) => t.key === tileKey);
      if (tile) {
        accruedMinutes += tile.duration;
        tile.penalties?.forEach((penalty) => {
          const handler = effectHandlers[penalty.type];
          if (handler) {
            accruedMinutes += handler(this._currentSequence, i, penalty);
          }
        });
        tile.bonuses?.forEach((bonus) => {
          const handler = effectHandlers[bonus.type];
          if (handler) {
            accruedMinutes -= handler(this._currentSequence, i, bonus);
          }
        });
      }
    }
    this._currentTime = new Date(
      this._startTime.getTime() + accruedMinutes * 60000,
    );
  }

  public showOutcomeScreen(scene: Phaser.Scene): void {
    this._checkOutcome();
    new OutcomeScreen(scene, 0, 0);
  }

  public goNextLevel(scene: Phaser.Scene): void {
    this.level += 1;
    if (this.level > 3) {
      this.chapter += 1;
      this.level = 1;
    }
    if (this.chapter > 1) {
      scene.scene.start(SCENE_KEYS.GAME_COMPLETE);
      scene.scene.stop();
    } else {
      this.setupLevel();
      scene.scene.restart();
    }
  }

  private _checkOutcome(): void {
    // Placeholder logic for determining outcome
    const passesConstraints = this._validateConstraints();
    if (!passesConstraints) {
      this._outcome = OUTCOMES.FAIL;
    } else if (
      passesConstraints &&
      this._currentTime.getTime() <= this._idealEndTime.getTime()
    ) {
      this._outcome = OUTCOMES.IDEAL;
    } else if (passesConstraints) {
      this._outcome = OUTCOMES.ON_TIME;
    } else {
      this._outcome = OUTCOMES.LATE;
    }
    // DEBUG: For testing purposes, always set to ON_TIME
    this._outcome = OUTCOMES.ON_TIME;
  }

  public resetLevel(scene: Phaser.Scene): void {
    this._currentSequence = [];
    this.setupLevel();
    scene.scene.restart();
  }

  private _validateConstraints(): boolean {
    for (const constraint of this._constraints) {
      const index = this._currentSequence.findIndex(
        (t) => t === constraint.tileKey,
      );
      if (index === -1) {
        return false;
      }

      if (constraint.type === "mustBeFirst" && index !== 0) {
        return false;
      } else if (
        constraint.type === "mustBeLast" &&
        index !== this._currentSequence.length - 1
      ) {
        return false;
      }
      if (
        constraint.type === "mustComeBefore" &&
        constraint.second != undefined
      ) {
        const secondIndex = this._currentSequence.findIndex(
          (t) => t === constraint.second,
        );
        if (index >= secondIndex) {
          return false;
        }
      }
    }
    return (
      new Set(this._currentSequence.filter((t) => t !== undefined)).size ===
      this._currentSequence.length
    );
  }
}
