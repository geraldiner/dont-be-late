import chapter1Data from "../assets/data/chapter_1.json";
import tileLayoutData from "../assets/data/tile_layout.json";

export class DataManager {
  private static instance: DataManager;
  private constructor() {}
  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  public getChapterData(chapter: number): any {
    switch (chapter) {
      case 1:
        return chapter1Data;
      default:
        console.error(`Chapter data for chapter ${chapter} not found.`);
        return null;
    }
  }

  public getTileLayout(key: string): Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }> {
    switch (key) {
      case "5":
        return tileLayoutData["5"];
      default:
        console.error(`Tile layout data for key ${key} not found.`);
        return [];
    }
  }
}
