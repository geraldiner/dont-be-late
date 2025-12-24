import { ASSET_KEYS } from "./assets";
import { COLORS, type Color } from "./colors";

const CHAPTERS = {
  SCHOOL: "school",
} as const;

type ChapterTheme = {
  headerImageKey: string;
  pageIconKey: string;
  accentImageKey: string;
  mainColor: Color;
  accentColor: Color;
};

const CHAPTER_THEME_MAP: Record<
  (typeof CHAPTERS)[keyof typeof CHAPTERS],
  ChapterTheme
> = {
  [CHAPTERS.SCHOOL]: {
    headerImageKey: ASSET_KEYS.HEADER_SCHOOL,
    pageIconKey: ASSET_KEYS.ICON_TRIANGULAR_RULER,
    accentImageKey: ASSET_KEYS.ACCENT_SCHOOL,
    mainColor: COLORS.YELLOW,
    accentColor: COLORS.LIGHT_YELLOW,
  },
};

export { CHAPTERS, CHAPTER_THEME_MAP };
export type { ChapterTheme };
