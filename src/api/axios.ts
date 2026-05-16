import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

if (!import.meta.env.VITE_TMDB_API_KEY) {
  console.warn("TMDB API Key is missing! Check your environment variables.");
}

export default instance;
