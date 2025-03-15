export const unixConvertation = (unixTime: number): string => {
  const date = new Date(unixTime * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};
