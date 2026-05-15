export function truncate(str: string, n: number): string {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

export const getPlayableCache = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem("playableCache") || "{}");
  } catch {
    return {};
  }
};

export const setPlayableCache = (id: number, type: "movie" | "tv", hasVideo: boolean) => {
  const cache = getPlayableCache();
  cache[`${type}-${id}`] = hasVideo;
  localStorage.setItem("playableCache", JSON.stringify(cache));
};
