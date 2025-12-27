export * from "./audio";
export * from "./colors";
export * from "./images";
export * from "./padding";
export * from "./scenes";
export * from "./shapes";
export * from "./sizes";
export * from "./tiles";
export * from "./typography";

// OUTCOME CONSTANTS
export const OUTCOMES = {
  IDEAL: "ideal",
  ON_TIME: "on_time",
  FAIL: "fail",
} as const;

export const GAME_CONSTANTS = {
  SAVE_DATA_KEY: "dont_be_late_save_data",
} as const;
