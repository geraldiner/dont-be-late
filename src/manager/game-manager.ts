import { OutcomeScreen } from "../game-screens/outcome";
import { effectHandlers } from "../utils";
import { OUTCOMES, SCENE_KEYS } from "../variables";
import { DataManager } from "./data-manager";

interface Tile {
  key: string;
  label: string;
  duration: number;
  penalties?: Array<{ type: string; extraMinutes: number }>;
  bonuses?: Array<{ type: string; reducedMinutes: number }>;
}

export class GameManager {
  // Tiles
  private _availableTiles: Tile[] = [];
  public get availableTiles(): Tile[] {
    return this._availableTiles;
  }
  private _placedTiles: string[] = [];
  public get placedTiles(): string[] {
    return this._placedTiles;
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

  // Level rules
  private _fixedPositions: Array<{ tileKey: string; position: number }> = [];
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
    this._fixedPositions = levelData.fixedPositions;
    this._constraints = levelData.constraints;
  }

  public updatePlacedTiles(
    addTileIndex?: number,
    addedTileKey?: string,
    previousSlotIndex?: number | null,
  ): void {
    // If there is already a tile at that index, remove it first
    if (previousSlotIndex !== undefined && previousSlotIndex !== null) {
      this._placedTiles[previousSlotIndex] = undefined!;
      this.updateTimes();
    }
    // If adding a tile, set it at the given index
    if (addTileIndex !== undefined && addedTileKey !== undefined) {
      this._placedTiles[addTileIndex] = addedTileKey;
      this.updateTimes();
    }
  }

  // Update the current time based on placed tiles
  public updateTimes(): void {
    let accruedMinutes = 0; // time in minutes
    // Add base duration from placed tiles
    for (let i = 0; i < this._placedTiles.length; i++) {
      const tileKey = this._placedTiles[i];
      const tile = this._availableTiles.find((t) => t.key === tileKey);
      if (tile) {
        accruedMinutes += tile.duration;
        tile.penalties?.forEach((penalty) => {
          const handler = effectHandlers[penalty.type];
          if (handler) {
            accruedMinutes += handler(this._placedTiles, i, penalty);
          }
        });
        tile.bonuses?.forEach((bonus) => {
          const handler = effectHandlers[bonus.type];
          if (handler) {
            accruedMinutes -= handler(this._placedTiles, i, bonus);
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
    this._outcome = OUTCOMES.ON_TIME;
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

  private _validateConstraints(): boolean {
    for (const constraint of this._constraints) {
      const index = this._placedTiles.findIndex(
        (t) => t === constraint.tileKey,
      );
      if (index === -1) {
        return false;
      }

      if (constraint.type === "mustBeFirst" && index !== 0) {
        return false;
      } else if (
        constraint.type === "mustBeLast" &&
        index !== this._placedTiles.length - 1
      ) {
        return false;
      }
      if (
        constraint.type === "mustComeBefore" &&
        constraint.second != undefined
      ) {
        const secondIndex = this._placedTiles.findIndex(
          (t) => t === constraint.second,
        );
        if (index >= secondIndex) {
          return false;
        }
      }
    }
    return (
      new Set(this._placedTiles.filter((t) => t !== undefined)).size ===
      this._placedTiles.length
    );
  }
}
