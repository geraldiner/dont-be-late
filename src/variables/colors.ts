export type Color = {
  hex: string;
  number: number;
};

export const COLORS = {
  BLACK: { hex: "#383836", number: 0x383836 },
  BLUE: { hex: "#90E0EF", number: 0x90e0ef },
  LIGHT_BROWN: { hex: "#cfac8c", number: 0xcfac8c },
  GRAY: { hex: "#d3d4cf", number: 0xd3d4cf },
  LIGHT_GRAY: { hex: "#e5e7eb", number: 0xe5e7eb },
  WHITE: { hex: "#ffffff", number: 0xffffff },
  YELLOW: { hex: "#ffe162", number: 0xffe162 },
} as const;
