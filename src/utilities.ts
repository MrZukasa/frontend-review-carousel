export const getThumbnailName = (url: string): string => {
  // Metodo con regex
  const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `${match[1]}-SD.jpg`;
  }
  return "";
};
