// SCENE KEYS
export const SCENE_KEYS = {
  PRELOAD: "preload",
  TITLE: "title",
  GAME: "game",
  GAME_COMPLETE: "game_complete",
} as const;

// FONT KEYS
export const FONT_KEYS = {
  REGULAR: "regular",
} as const;

// TEXTURE_KEYS
export const TEXTURE_KEYS = {
  BUTTON: "button",
  BUTTON_DISABLED: "button_disabled",
  SQUARE: "square",
  TWO_THIRDS_RECTANGLE: "two_thirds_rectangle",
  HALF_RECTANGLE: "half_rectangle",
  FULL_RECTANGLE: "full_rectangle",
} as const;

// ASSET_KEYS
export const ASSET_KEYS = {
  ALARM: "alarm",
  BACKPACK: "backpack",
  BELL: "bell",
  BOARD: "board",
  CHARGE: "charge",
  COFFEE: "coffee",
  EMAIL: "email",
  FOLDERS: "folders",
  FOOD: "food",
  GROUP: "group",
  HOODIE: "hoodie",
  KID: "kid",
  LEGO: "lego",
  LUNCHBOX: "lunchbox",
  OPEN_DOOR: "open_door",
  SCROLL: "scroll",
  TOILET: "toilet",
  TRAIN: "train",
  VAN: "van",
  CHAPTER_1_PRELUDE: "chapter_1_prelude",
} as const;

// SIZING CONSTANTS
export const SIZING = {
  PADDING: 10,
  PANEL_WIDTH: 342,
  PANEL_HEIGHT: 410,
  TILE_SIZE: 80,
  BUTTON_WIDTH: 90,
  BUTTON_HEIGHT: 25,
} as const;

// OUTCOME CONSTANTS
export const OUTCOMES = {
  IDEAL: "ideal",
  ON_TIME: "on_time",
  LATE: "late",
  FAIL: "fail", // TODO: Will there be a difference between late and fail?
} as const;
