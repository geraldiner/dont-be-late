import { TILE_KEYS } from "../variables";

interface EffectRule {
  type: string;
  extraMinutes?: number;
  target?: string;
  exclude?: Array<string>;
}

type EffectHandler = (
  sequence: Array<string>,
  index: number,
  rule: EffectRule,
) => number;

export const effectHandlers: Record<string, EffectHandler> = {
  scrollingSecondAfterAlarm(sequence, index) {
    return index === 1 && sequence[index - 1] === TILE_KEYS.ALARM ? 20 : 0;
  },
};
