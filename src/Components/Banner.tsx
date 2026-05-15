import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import requests from "../api/requests";
import { useNavigate } from "react-router-dom";
import { BannerSkeleton } from "./Skeleton";
import { truncate } from "../utils";
import { Movie } from "../types";



const Banner: React.FC = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(requests.fetchNetflixOriginals);
        const data = response.data.results;
        const validMovies = data.filter((m: Movie) => m.backdrop_path && m.overview);
        const randomMovie = validMovies[Math.floor(Math.random() * validMovies.length)];
        setMovie(randomMovie || data[0]);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (movie?.backdrop_path) {
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
      img.onload = () => setImageLoaded(true);
    }
  }, [movie]);

  if (!movie || !imageLoaded) return <BannerSkeleton />;

  return (
    <header
      className="relative h-[80vh] md:h-[95vh] text-white overflow-hidden"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "top center",
      }}
    >
      {/* Dark Overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-100" />

      <div className="relative z-10 ml-4 md:ml-12 pt-[25vh] md:pt-[35vh]">
        <h1 className="text-3xl md:text-6xl font-black mb-4 max-w-[90%] md:max-w-[70%] drop-shadow-lg">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <div className="flex space-x-3 md:space-x-4 mt-6">
          <button 
            onClick={() => navigate(`/watch/${movie.media_type || (movie.title ? 'movie' : 'tv')}/${movie.id}`)}
            className="flex items-center justify-center cursor-pointer text-black font-bold rounded px-6 md:px-8 py-2 bg-white hover:bg-opacity-80 transition-all duration-200 text-sm md:text-xl"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Play
          </button>
          <button className="flex items-center justify-center cursor-pointer text-white font-bold rounded px-6 md:px-8 py-2 bg-gray-500 bg-opacity-70 hover:bg-opacity-50 transition-all duration-200 text-sm md:text-xl">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </button>
        </div>

        <p className="w-full md:w-[45rem] leading-[1.4] pt-6 text-sm md:text-xl max-w-[95%] md:max-w-[40%] h-[120px] drop-shadow-md">
          {truncate(movie?.overview || "", 180)}
        </p>
      </div>

      <div className="h-[7.4rem] absolute bottom-0 w-full z-10" />
    </header>
  );
};

export default Banner;
