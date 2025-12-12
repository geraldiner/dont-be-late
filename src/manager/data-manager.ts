import chapter1Data from "../assets/data/chapter_1.json";
import panelLayoutData from "../assets/data/panel_layout.json";
import panelSlotSizes from "../assets/data/panel_slot_sizes.json";

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

  public getPanelSlotSizes(
    key: string,
  ): { width: number; height: number } | null {
    switch (key) {
      case "SQUARE":
        return panelSlotSizes.SQUARE;
      case "TWO_THIRDS_RECTANGLE":
        return panelSlotSizes.TWO_THIRDS_RECTANGLE;
      case "HALF_RECTANGLE":
        return panelSlotSizes.HALF_RECTANGLE;
      case "FULL_RECTANGLE":
        return panelSlotSizes.FULL_RECTANGLE;
      default:
        console.error(`Panel slot size for key ${key} not found.`);
        return null;
    }
  }

  public getPanelLayout(key: string): Array<{
    x: number;
    y: number;
    texture: string;
  }> {
    switch (key) {
      case "5":
        return panelLayoutData["5"];
      case "8":
        return panelLayoutData["8"];
      default:
        console.error(`Tile layout data for key ${key} not found.`);
        return [];
    }
  }
}
