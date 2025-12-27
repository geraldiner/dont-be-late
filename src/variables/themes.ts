import { COLORS, type Color } from "./colors";
import { IMAGE_KEYS } from "./images";

const CHAPTERS = {
  SCHOOL: "school",
  WORK: "work",
} as const;

type ChapterTheme = {
  headerImageKey: string;
  pageIconKey: string;
  accentImageKey: string;
  mainColor: Color;
};

const CHAPTER_THEME_MAP: Record<
  (typeof CHAPTERS)[keyof typeof CHAPTERS],
  ChapterTheme
> = {
  [CHAPTERS.SCHOOL]: {
    headerImageKey: IMAGE_KEYS.HEADER_SCHOOL,
    pageIconKey: IMAGE_KEYS.ICON_TRIANGULAR_RULER,
    accentImageKey: IMAGE_KEYS.ACCENT_SCHOOL,
    mainColor: COLORS.YELLOW,
  },
  [CHAPTERS.WORK]: {
    headerImageKey: IMAGE_KEYS.HEADER_WORK,
    pageIconKey: IMAGE_KEYS.ICON_WHITE_COLLAR,
    accentImageKey: IMAGE_KEYS.ACCENT_WORK,
    mainColor: COLORS.BLUE,
  },
};

export { CHAPTERS, CHAPTER_THEME_MAP };
export type { ChapterTheme };
