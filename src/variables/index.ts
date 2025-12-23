export * from "./assets";
export * from "./colors";
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
  LATE: "late",
  FAIL: "fail", // TODO: Will there be a difference between late and fail?
} as const;
