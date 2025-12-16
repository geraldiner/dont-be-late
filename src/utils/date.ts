const formatTime = (date: Date): string => {
  const hours: string = date.getHours().toString().padStart(2, "0");
  const minutes: string = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes} ${date.getHours() >= 12 ? "PM" : "AM"}`;
};

export { formatTime };
