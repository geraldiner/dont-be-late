import { effectHandlers } from "../utils";
import { OUTCOMES } from "../variables";
import { DataManager } from "./data_manager";

export interface Tile {
  key: string;
  label: string;
  duration: number;
  fixedPositionIndex?: number;
  effects?: Array<{ id: string; minutesToApply: number }>;
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
  public chapterId: string = "";

  public chapter: number = 1;
  public chapterTitle: string = "";

  public level: number = 3;
  public levelTitle: string = "";

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
    tileKey: string;
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
    this.chapterId = chapterData.id;
    this.chapterTitle = chapterData.title;
    this.levelTitle = levelData.title;
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
        tile.effects?.forEach((effect) => {
          const handler = effectHandlers[effect.id];
          if (handler) {
            accruedMinutes += handler(this._currentSequence, i, effect);
          }
        });
      }
    }
    this._currentTime = new Date(
      this._startTime.getTime() + accruedMinutes * 60000,
    );
  }

  public advanceLevel(): void {
    this.level += 1;
    if (this.level > 3) {
      this.chapter += 1;
      this.level = 1;
    }
  }

  public shouldGoToEndGame(): boolean {
    return this.chapter > 1;
  }

  public updateOutcome(): void {
    const passesConstraints = this._validateConstraints();
    if (
      passesConstraints &&
      this._currentTime.getTime() < this._idealEndTime.getTime()
    ) {
      this._outcome = OUTCOMES.IDEAL;
    } else if (
      passesConstraints &&
      this._currentTime.getTime() < this._targetTime.getTime()
    ) {
      this._outcome = OUTCOMES.ON_TIME;
    } else {
      this._outcome = OUTCOMES.FAIL;
    }
    // DEBUG: For testing purposes, always set to ON_TIME
    // this._outcome = OUTCOMES.ON_TIME;
  }

  public resetLevel(scene: Phaser.Scene): void {
    this._currentSequence = [];
    this.setupLevel();
    scene.scene.restart();
  }

  public resetGame(): void {
    this.chapter = 1;
    this.level = 1;
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
    return true;
  }
}
