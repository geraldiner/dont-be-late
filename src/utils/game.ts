const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[rand]] = [
      shuffledArray[rand],
      shuffledArray[i],
    ];
  }
  return shuffledArray;
};

export { shuffleArray };
