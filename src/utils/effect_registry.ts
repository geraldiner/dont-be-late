interface EffectRule {
  id: string;
  minutesToApply: number;
  target?: string;
  excludedTiles?: Array<string>;
}

type EffectHandler = (
  sequence: Array<string>,
  index: number,
  rule: EffectRule,
) => number;

export const effectHandlers: Record<string, EffectHandler> = {
  beforeCoffee(sequence, index, rule) {
    const tilesBeforeCoffee = sequence
      .slice(0, index)
      .filter((key) => !rule.excludedTiles.includes(key));
    return rule.minutesToApply * tilesBeforeCoffee.length;
  },
  breakfastAndPackedLunchKitchenBonus(sequence, index, rule) {
    const targetIndex = sequence.indexOf(rule.target);
    return targetIndex - 1 === index || targetIndex + 1 === index
      ? rule.minutesToApply
      : 0;
  },
  checkEmailsFirst(sequence, index, rule) {
    return index === 0 ? rule.minutesToApply : 0;
  },
  makeCopiesMultiplier(sequence, index, rule) {
    const tier = Math.floor((index + 1) / 2);
    return (tier === 0 ? 1 : tier) * rule.minutesToApply;
  },
  pickUpMaterialsAtPTC(sequence, index, rule) {
    const targetIndex = sequence.indexOf(rule.target);
    return targetIndex + 1 === index ? rule.minutesToApply : 0;
  },
  scrollingSecondAfterAlarm(sequence, index, rule) {
    return index === 1 && sequence[index - 1] === rule.target
      ? rule.minutesToApply
      : 0;
  },
};
