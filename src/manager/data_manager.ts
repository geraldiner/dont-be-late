import chapter1Data from "../assets/data/chapter_1.json";
import chapter2Data from "../assets/data/chapter_2.json";
import {
  type CHAPTERS,
  CHAPTER_THEME_MAP,
  type ChapterTheme,
} from "../variables/themes";

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
      case 2:
        return chapter2Data;
      default:
        console.error(`Chapter data for chapter ${chapter} not found.`);
        return null;
    }
  }

  public getAllChapterData(): any[] {
    return [chapter1Data, chapter2Data];
  }

  public getChapterTheme(
    chapterId: (typeof CHAPTERS)[keyof typeof CHAPTERS],
  ): ChapterTheme | null {
    if (!Object.hasOwnProperty.call(CHAPTER_THEME_MAP, chapterId)) {
      console.error(`Theme for chapter ${chapterId} not found.`);
      return null;
    }
    return CHAPTER_THEME_MAP[chapterId];
  }
}
