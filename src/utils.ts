export function truncate(str: string, n: number): string {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

export const getPlayableCache = (): Record<number, boolean> => {
  try {
    return JSON.parse(localStorage.getItem("playableCache") || "{}");
  } catch {
    return {};
  }
};

export const setPlayableCache = (id: number, hasVideo: boolean) => {
  const cache = getPlayableCache();
  cache[id] = hasVideo;
  localStorage.setItem("playableCache", JSON.stringify(cache));
};
