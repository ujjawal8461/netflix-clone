export interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genres?: { id: number; name: string }[];
  status?: string;
  budget?: number;
  videos?: {
    results: {
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  hasVideo?: boolean;
}
