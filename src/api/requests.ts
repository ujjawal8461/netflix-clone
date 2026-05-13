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
  fetchSearch: string;
  fetchRecommendations: (id: string | number) => string;
  fetchMovieDetails: (id: string | number) => string;
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
  fetchSearch: `/search/multi?api_key=${API_KEY}&language=en-US&include_adult=false&query=`,
  fetchRecommendations: (id: string | number) => `/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`,
  fetchMovieDetails: (id: string | number) => `/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`,
};

export default requests;
