interface Requests {
  fetchTrending: string;
  fetchNetflixOriginals: string;
  fetchTopRated: string;
  fetchActionMovies: string;
  fetchComedyMovies: string;
  fetchHorrorMovies: string;
  fetchRomanceMovies: string;
  fetchDocumentaries: string;
  fetchPopular: string;
  fetchSciFiMovies: string;
  fetchAnimationMovies: string;
  fetchMysteryMovies: string;
  fetchThrillerMovies: string;
  fetchHistoryMovies: string;
  fetchFamilyMovies: string;
  fetchKidsTv: string;
  fetchAdventureMovies: string;
  fetchFantasyMovies: string;
  fetchSearch: string;
  fetchRecommendations: (id: string | number) => string;
  fetchMovieDetails: (id: string | number) => string;
  fetchTvDetails: (id: string | number) => string;
  fetchTvRecommendations: (id: string | number) => string;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const requests: Requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchPopular: `/movie/popular?api_key=${API_KEY}&language=en-US`,
  fetchSciFiMovies: `/discover/movie?api_key=${API_KEY}&with_genres=878`,
  fetchAnimationMovies: `/discover/movie?api_key=${API_KEY}&with_genres=16`,
  fetchMysteryMovies: `/discover/movie?api_key=${API_KEY}&with_genres=9648`,
  fetchThrillerMovies: `/discover/movie?api_key=${API_KEY}&with_genres=53`,
  fetchHistoryMovies: `/discover/movie?api_key=${API_KEY}&with_genres=36,10752`,
  fetchFamilyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10751`,
  fetchKidsTv: `/discover/tv?api_key=${API_KEY}&with_genres=10762`,
  fetchAdventureMovies: `/discover/movie?api_key=${API_KEY}&with_genres=12`,
  fetchFantasyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=14`,
  fetchSearch: `/search/multi?api_key=${API_KEY}&language=en-US&include_adult=false&query=`,
  fetchRecommendations: (id: string | number) => `/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`,
  fetchMovieDetails: (id: string | number) => `/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`,
  fetchTvDetails: (id: string | number) => `/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`,
  fetchTvRecommendations: (id: string | number) => `/tv/${id}/recommendations?api_key=${API_KEY}&language=en-US`,
};

export default requests;
